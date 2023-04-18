const path = require('path');

module.exports = {
  root: true,
  extends: ['octopuzzles-basic'],
  parserOptions: {
    project: [path.join(__dirname, './tsconfig.json')]
  }
};
