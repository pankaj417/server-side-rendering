var path = require('path')
var webpack = require('webpack')
var DEBUG = !(process.env.NODE_ENV === 'production')
var env = {
  NODE_ENV: process.env.NODE_ENV,
}
var config = {
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  entry: {
    bundle: './src/index',
    vendor: [
      'react',
      'react-router',
      'redux',
      'react-dom',
      'lodash',
      'bluebird',
      'humps',
      'history'
    ]
  },
  resolve: {
    root: [ path.join(__dirname, 'src') ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: __dirname,
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
console.log(DEBUG)
if (DEBUG) {
  config.entry.dev = [
    'webpack-dev-server/client?http://localhost:5000',
    'webpack/hot/only-dev-server',
  ]
  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
  ])
  config.output.publicPath = 'http://localhost:5000'
  config.module.loaders[0].query = {
    "env": {
      "development": {
        "presets": ["react-hmre"]
      }
    }
  }
} else {
  console.log('I am in else')
  config.plugins = config.plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filname: '[name].[chunkhash].js'
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ])
}

module.exports = config