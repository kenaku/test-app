import shared, {
  simpleLoaders,
  loadersConfigs,
  optimizationPlugins,
  resolve,
} from './shared.babel'

export default {
  entry: {
    app: './app/browser.js',
  },

  devtool: 'source-map',

  resolve,

  output: {
    path: shared.output.path,
    publicPath: shared.output.publicPath,
    filename: '[name]@[chunkhash].js',
  },

  plugins: [
    shared.plugins.stylesExtractions,
    shared.plugins.globals,
    ...optimizationPlugins,
    shared.plugins.stats,
  ],

  module: {
    loaders: [
      shared.loaders.js,
      shared.loaders.stylesExtraction,
      ...simpleLoaders
    ]
  },

  ...loadersConfigs,
}
