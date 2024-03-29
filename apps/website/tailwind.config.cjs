const sharedConfig = require('tailwind-config/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [
    './src/**/*.{html,js,svelte,ts}',
    '../../packages/ui/src/**/*.{html,js,svelte,ts}',
    '../../packages/sudoku-display/src/**/*.{html,js,svelte,ts}',
    '../../packages/sudoku-editor/src/**/*.{html,js,svelte,ts}',
    '../../packages/sudoku-game/src/**/*.{html,js,svelte,ts}',
    '../../packages/icons/src/**/*.{html,js,svelte,ts}',
    '../../packages/walkthroughs/src/**/*.{html,js,svelte,ts}'
  ]
};
