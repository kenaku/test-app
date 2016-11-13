import shared, {
  simpleLoaders,
  hotPlugins,
  loadersConfigs,
  resolve,
} from './shared.babel'

export default {
  entry: {
    app: [
      'webpack-hot-middleware/client?overlay=false',
      './app/browser.js',
    ]
  },

  devtool: 'source-map',

  resolve,

  output: {
    path: shared.output.path,
    publicPath: shared.output.publicPath,
    filename: '[name].js',
    library: '[name]',
  },

  plugins: [
    shared.plugins.globals,
    ...hotPlugins,
  ],

  module: {
    loaders: [
      shared.loaders.jsHot,
      shared.loaders.stylesHot,
      ...simpleLoaders,
    ]
  },

  devServer: {
    port: 8080,
    inline: true,
    hot: true,
    quiet: false,
    noInfo: true,
    stats: {
      cached: false,
      exclude: [/node_modules/],
    },
  },

  ...loadersConfigs,
}
