const ip = require('ip');
const { makeWebpackConfig } = require('webpack-simple');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = makeWebpackConfig({
  devServer: {
    host: ip.address(),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.template.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: 'index.template.html',
      filename: 'freakmaster/index.html',
    }),
  ],
});
