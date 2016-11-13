/* eslint no-console:0 */
import path from 'path'
import fileSystem from 'fs'
import MemoryFS from 'memory-fs'
import requireFromString from 'require-from-string'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddlewareConstructor from 'webpack-dev-middleware'
import webpackHotMiddlewareConstructor from 'webpack-hot-middleware'
import get from 'lodash/get'

import configBrowser from '../webpack/browser.dev.babel'
import configPrerender from '../webpack/prerender.dev.babel'

// server port
export const PORT = +(process.env.PORT || 8080)

export function getStatics() {
  // requiring at runtime is cumbersome :(
  let stats = fileSystem.readFileSync('build/stats.json')

  // do not wrap in try-catch. it should fail if something went wrong.
  stats = JSON.parse(stats)

  return {
    js: get(stats, 'assetsByChunkName.app[0]', 'app.js'),
    css: get(stats, 'assetsByChunkName.app[1]', 'app.css'),
  }
}

// wow this tricky one
// this is basicly manualy constructed webpackDevMiddleware
// that we do is we watch for prerender in separate webpack compiler
// and on compile we construct new node module from string
// and pass it to callback :)
// this way we can have hot reload in server prerender (which is cool)
// and do not break our client hot server with node restarting
export function watchPrerenderCompiler(callback) {
  const prerenderCompiler = webpack(configPrerender)

  const fs = new MemoryFS()

  prerenderCompiler.outputFileSystem = fs

  prerenderCompiler.watch({}, (err, stats) => {
    if (err) {
      console.log(err.stack)
      callback(err)
      return
    }
    try {
      const assetsByChunkName = stats.toJson({}).assetsByChunkName
      const prerenderFileName = assetsByChunkName.prerender[0]
      const prerenderFile = path.join(__dirname, 'build', prerenderFileName)

      console.log(fs.readdirSync('/'), path.join(__dirname, 'build', prerenderFileName))
      const content = fs.readFileSync(prerenderFile, 'utf-8')
      const prerender = requireFromString(content)

      console.log('Prerender compiled sucessfully!')

      callback(null, prerender)
    } catch (e) {
      console.log('Prerender compile error!', e.stack)

      callback(e, null)
    }
  })
}


// browser bundle is avaliable through webpack middleware and stuff
// nothing fancy, just works in-memory and serves assets
const compiler = webpack(configBrowser)

export const webpackDevMiddleware = webpackDevMiddlewareConstructor(compiler, {
  noInfo: true,
  publicPath: '/assets',
  stats: {
    colors: true
  },
})

export const webpackHotMiddleware = webpackHotMiddlewareConstructor(compiler, {
  log: console.log,
  publicPath: '/assets',
})

// public/assets for production mainly, but public should be mounted in dev
// for favicons and stuff like that (some browsers required it to be served from root url)
// NOTE: try not to place where any images/fonts etc, serve them as assets via webpack
export const publicMiddeware = express.static(path.join('public'))

export const assetsMiddleware = express.static(path.join('build'), {
  maxAge: '365d',
})

export function addClosingSlashMiddlewara(req, res, next) {
  const asArray = req.url.split('?')
  const beforeQuery = asArray[0]
  const query = asArray[1] ? `?${asArray[1]}` : ''

  if (beforeQuery.substr(-1) === '/') {
    next()
  } else {
    res.redirect(301, `${beforeQuery}/${query}`)
  }
}
