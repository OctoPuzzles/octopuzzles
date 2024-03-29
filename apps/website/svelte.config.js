import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    vitePreprocess({
      postcss: true
    })
  ],
  kit: {
    adapter: adapter(),
    alias: {
      $utils: 'src/utils',
      $components: 'src/components',
      $features: 'src/features',
      $stores: 'src/stores',
      $server: 'src/server'
    },
    env: {
      dir: '../..'
    }
  }
};

export default config;
