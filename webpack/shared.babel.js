/* eslint max-len:0 */
import webpack from 'webpack'
import fs from 'fs'
import path from 'path'
import StatsPlugin from 'stats-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'
import dotenv from 'dotenv'
import snakeCase from 'lodash/snakeCase'
import map from 'lodash/map'

// use __DIR instead of __dirname
// will be resolved (or SHOULD be resolved)
// to project root
const __DIR = path.resolve('./')
// loading .env config vars into process.env

dotenv.config({
  path: path.join(__DIR, '.env')
})

const GLOBALS = {
  DEV: true,
  DEV_PRERENDER: false,
  USE_HOT_PRERENDER: false,
  GA: null,
}


function addGlobal(defaultValue = null, name = '') {
  const globalizedName = snakeCase(name).toUpperCase()

  return [
    `__${globalizedName}__`,
    JSON.stringify(process.env[globalizedName] || defaultValue),
  ]
}


// will compose globals like {__NAME__: JSON.stringify(process.env.NAME || 'default')}
// globals itlsef expected to be provide with heroku settings
// or .dev file with foreman runner
function composeGlobals(globals) {
  const result = {}

  map(globals, (defaultValue, name) => {
    const [globalizedName, value] = addGlobal(defaultValue, name)

    result[globalizedName] = value
  })

  return result
}


const nodeEnvFromProcess = JSON.stringify(process.env.NODE_ENV || 'development')


const globals = {
  __dirname: JSON.stringify(__DIR),
  __filename: JSON.stringify(path.join(__DIR, 'index.js')),
  NODE_ENV: nodeEnvFromProcess,
  'process.env.NODE_ENV': nodeEnvFromProcess,
  ...composeGlobals(GLOBALS),
}


const nodeModulesRegex = /node_modules/

const cssModulesString = 'disableStructuralMinification&modules&localIdentName=[name]-[local]-[hash:base64:5]!postcss!stylus'

const config = {
  output: {
    path: path.join(__DIR, 'build'),
    publicPath: '/assets/',
  },

  root: path.join(__DIR, 'app'),

  extensions: ['', '.js', '.jsx'],

  // loaded configs to use
  loaders: {
    js: {
      test: /\.js|jsx$/,
      loader: 'babel',
      exclude: nodeModulesRegex,
      include: __DIR
    },
    mustache: {
      test: /.html|mustache|mu$/,
      loader: 'mustache',
    },
    jsHot: {
      test: /\.js|jsx$/,
      loader: 'react-hot!babel',
      exclude: nodeModulesRegex,
      include: __DIR
    },
    jsHotServer: {
      test: /\.js|jsx$/,
      loader: 'babel',
      exclude: nodeModulesRegex,
      include: __DIR
    },
    styles: {
      test: /.styl$/,
      loader: `css-loader/locals?${cssModulesString}`,
    },
    stylesHot: {
      test: /.styl$/,
      loader: `style!css?${cssModulesString}`,
    },
    stylesExtraction: {
      test: /.styl$/,
      loader: ExtractTextPlugin.extract('style-loader', `css?${cssModulesString}`)
    },
    json: {
      test: /.json$/,
      loader: 'json',
    },
    smallPng: {
      test: /\.(png|gif)$/,
      loader: 'url?name=[name]@[hash].[ext]&limit=5000'
    },
    svg: {
      test: /\.svg$/,
      loader: 'svg-inline',
    },
    // eah. inlining woff to prevent fonts flickering
    inlineWoff: {
      test: /\.(woff|woff2)$/,
      loader: 'url?name=[name]@[hash].[ext]&limit=1000000'
    },
    restFiles: {
      test: /\.(jpg|otf|ttf|eot|mp4|webm)$/,
      loader: 'file?name=[name]@[hash].[ext]'
    },
  },


  plugins: {
    // https://github.com/webpack/webpack/issues/353
    // strangly appears
    ignoreVertx: new webpack.IgnorePlugin(/vertx/),
    // sourcemaps for node plugin
    sourcemaps: new webpack.BannerPlugin('require("source-map-support").install();', {
      raw: true,
      entryOnly: false
    }),
    // global variables
    globals: new webpack.DefinePlugin(globals),

    // stats file writing
    stats: new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [
        nodeModulesRegex
      ],
      source: false,
    }),

    // hot
    order: new webpack.optimize.OccurenceOrderPlugin(),
    hot: new webpack.HotModuleReplacementPlugin(),
    noErrors: new webpack.NoErrorsPlugin(),

    // css extraction
    stylesExtractions: new ExtractTextPlugin('[name]@[contenthash].css', {
      allChunks: true
    }),

    // optimization
    deduplication: new webpack.optimize.DedupePlugin(),
    uglify: new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compressor: {
        warnings: false,
      },
    }),
  },

  stylus: {
    import: [
      path.join(__DIR, 'app', 'styles', 'vars.styl'),
    ],
  },

  postcss: () => {
    return [autoprefixer]
  }
}


export const resolve = {
  root: __DIR,
  extensions: ['', '.js', '.jsx'],
}

export default config

export {globals}

export const plugins = [
  config.plugins.ignoreVertx,
  config.plugins.globals,
]

// hot replacement plugins
// used together, useless when used separatly
export const hotPlugins = [
  config.plugins.order,
  config.plugins.hot,
  config.plugins.noErrors,
]

export const optimizationPlugins = [
  config.plugins.order,
  config.plugins.deduplication,
  config.plugins.uglify,
  config.plugins.noErrors,
]

// simple loaders with file/url loader - no-hot, no-config - nothing,
export const simpleLoaders = [
  config.loaders.restFiles,
  config.loaders.inlineWoff,
  config.loaders.json,
  config.loaders.smallPng,
  config.loaders.mustache,
]

// external config for stylus/svgo/etc
export const loadersConfigs = {
  stylus: config.stylus,
  postcss: config.postcss,
}

// on server we want to exclude node_modules from build
// to use native require() call to this modules
export function excludeNodeModules() {
  // fuck vertx :)
  const nodeModules = {
    vertx: 'commonjs vertx'
  }

  fs.readdirSync('node_modules')
    .filter((x) => ['.bin'].indexOf(x) === -1)
    .forEach((mod) => {
      nodeModules[mod] = `commonjs ${mod}`
    })

  return nodeModules
}
