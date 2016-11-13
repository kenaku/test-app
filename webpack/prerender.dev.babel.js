import shared, {
  simpleLoaders,
  hotPlugins,
  loadersConfigs,
  resolve,
  excludeNodeModules,
} from './shared.babel'

const nodeModules = excludeNodeModules()

export default {
  entry: {
    prerender: [
      './app/prerender.js',
    ]
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
    library: 'prerender',
    libraryTarget: 'commonjs2',
  },

  plugins: [
    shared.plugins.globals,
    shared.plugins.sourcemaps,
    shared.plugins.globals,
    ...hotPlugins,
  ],

  module: {
    loaders: [
      shared.loaders.jsHotServer,
      shared.loaders.styles,
      ...simpleLoaders,
    ]
  },

  ...loadersConfigs
}
