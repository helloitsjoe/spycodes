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

module.exports = [main];
