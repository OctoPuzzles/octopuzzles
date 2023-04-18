const path = require('path');

module.exports = {
  extends: ['octopuzzles-svelte'],
  parserOptions: {
    project: [path.join(__dirname, './tsconfig.json')]
  }
};
