module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
    'consistent-return': 'off',
    'max-classes-per-file': 'false',
  },
};
