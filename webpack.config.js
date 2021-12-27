const { makeWebpackConfig } = require('webpack-simple');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = makeWebpackConfig({
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
