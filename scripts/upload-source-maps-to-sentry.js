/* eslint-disable no-var, vars-on-top, no-console, no-inner-declarations, no-use-before-define */

var glob = require('glob')
var path = require('path')
var fs = require('fs')
var superagent = require('superagent')

var baseApiUrl = process.env.SENTRY_SOURCE_MAPS_API_BASE_URL
var baseSiteUrl = process.env.BASE_URL


if (!baseApiUrl) {
  console.log('You need to set SENTRY_SOURCE_MAPS_API_BASE_URL in order to upload source maps to Sentry.')
}

if (!baseSiteUrl) {
  console.log('You need to set BASE_URL in order to upload source maps to Sentry.')
}

var stats
try {
  stats = require('../build/stats.json')
} catch (e) {
  stats = null
}

if (!stats) {
  console.log('You need to run main build before source maps uploading script.')
}

var files
if (baseApiUrl && baseSiteUrl && stats) {
  console.log('Finding files to upload')
  files = glob.sync(path.join(__dirname, '..', 'build', 'public', '*.map'))
  console.log('Found:')
  console.log(files)

  if (files.length === 0) {
    console.log('Nothing to upload. Exit.')
    process.exit(0)
  }

  main()
}

function main() {

  var baseAssetsUrl = baseSiteUrl + '/_assets'

  var version = process.argv[2]
  if (version) {
    console.log('Using specified version:', version)
  } else {
    version = String(Math.random()).slice(2)
    console.log('Version is not specified, using randomly generated:', version)
  }

  console.log('Creating version.json in /build')
  fs.writeFileSync(path.join(__dirname, '..', 'build', 'version.json'), JSON.stringify({version: version}, null, 2))

  console.log('Creating a Sentry release')
  superagent
    .post(baseApiUrl + '/releases/')
    .send({version: version})
    .end(continue1)

  function continue1(err) {
    if (err) {
      console.log('Failed on "Creating a Sentry release"', err)
      process.exit(1)
    }

    console.log('Start uploading files')
    uploadNext(null)
  }

  function uploadNext(err) {
    if (err) {
      console.log('Failed on "Uploading file"', err)
      process.exit(1)
    }

    if (files.length === 0) {
      console.log('Done uploading files.')
      return
    }

    var file = files.pop()
    var name = findInStats(file)
    if (name === null) {
      console.log('Couldn\'t find file ' + file + ' in build/stats.json. Skipping this file.')
      uploadNext()
      return
    }

    console.log('Uploading ' + name)
    superagent
      .post(baseApiUrl + '/releases/' + version + '/files/')
      .field('name', baseAssetsUrl + '/' + name)
      .attach('file', file)
      .end(uploadNext)
  }

}

function findInStats(filePath) {
  var fileName = path.basename(filePath)
  var asset
  for (var i = 0; i < stats.assets.length; i++) {
    asset = stats.assets[i]
    if (asset.name.split('?')[0] === fileName) {
      return asset.name
    }
  }
  return null
}
