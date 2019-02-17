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
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader', options: { modules: true } }],
  },
];

const main = { module: { rules } };

module.exports = [main];
