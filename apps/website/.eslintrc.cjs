const path = require('path');

module.exports = {
  extends: ['octopuzzles-svelte'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    project: [path.join(__dirname, './tsconfig.json')],
    extraFileExtensions: ['.svelte']
  }
};
