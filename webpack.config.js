const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReloadPlugin = require('reload-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const purgeHtml = require('purgecss-from-html');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const glob = require('glob-all');
const tailwindcss = require('tailwindcss');

const isRelease = process.argv.indexOf('-p') !== -1;
const bundleName = `styles${isRelease ? '.min' : ''}.css`;

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: bundleName
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: ['node_modules/'],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: isRelease
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      }
    ]
  },
  devServer: {
    contentBase: __dirname,
    watchContentBase: true
  },
  plugins: [
    new ExtractTextPlugin(bundleName), 
    new ReloadPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new PurgecssPlugin({
      paths: glob.sync([
        path.join(__dirname, 'index.html')
      ]),
      extractors: [{
        extractor: purgeHtml,
        extensions: ['html']
      }]
    })
  ]
}
