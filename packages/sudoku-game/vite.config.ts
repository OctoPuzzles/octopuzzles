import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  define: {
    'import.meta.vitest': 'undefined',
    'process.env': process.env
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    includeSource: ['src/**/*.{js,ts}']
  },
  experimental: {
    prebundleSvelteLibraries: true
  }
};

export default config;
