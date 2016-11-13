import shared, {
  simpleLoaders,
  loadersConfigs,
  excludeNodeModules,
  resolve,
} from './shared.babel'

const nodeModules = excludeNodeModules()

export default {
  entry: {
    server: './server/production.js',
  },

  target: 'node',

  devtool: 'sourcemap',

  node: {
    console: true,
  },

  // node modules wont be packed, ther will be required() as should they.
  externals: nodeModules,

  resolve,

  output: {
    path: shared.output.path,
    filename: '[name].js',
  },

  plugins: [
    shared.plugins.sourcemaps,
    shared.plugins.globals,
  ],

  module: {
    loaders: [
      shared.loaders.js,
      shared.loaders.styles,
      ...simpleLoaders,
    ]
  },

  ...loadersConfigs
}
