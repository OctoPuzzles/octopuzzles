const path = require('path');

module.exports = {
  root: true,
  extends: ['octopuzzles-svelte'],
  parserOptions: {
    project: [path.join(__dirname, './tsconfig.json')]
  }
};
