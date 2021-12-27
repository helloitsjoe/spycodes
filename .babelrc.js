module.exports = {
  presets: ['@babel/react', ['@babel/env', { targets: { node: 'current' } }]],
  plugins: ['@babel/plugin-proposal-optional-chaining'],
};
