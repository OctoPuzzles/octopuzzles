const sharedConfig = require('tailwind-config/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: ['./src/**/*.{html,js,svelte,ts}', '../../packages/ui/src/**/*.{html,js,svelte,ts}']
};
