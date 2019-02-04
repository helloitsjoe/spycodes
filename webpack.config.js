const webpack = require('webpack');
const path = require('path');

const rules = [
  {
    test: /\.js$/,
    exclude: [/.json?/, /node_modules/],
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-class-properties'],
      },
    },
  },
];

const main = { module: { rules } };

const spymaster = {
  entry: path.resolve(__dirname, 'spymaster'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'spymaster.js',
  },
  module: {
    rules,
  },
};

module.exports = [main, spymaster];
