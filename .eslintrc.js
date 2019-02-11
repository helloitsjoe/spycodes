module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    jest: true,
  },
  parser: 'babel-eslint',
  rules: {
    quotes: 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
    'object-curly-spacing': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-prototype-builtins': 'off',
    'react/jsx-filename-extension': 'off',
    'react/destructuring-assignment': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'only-multiline'],
  },
};
