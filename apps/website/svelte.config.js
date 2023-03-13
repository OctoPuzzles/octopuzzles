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
      $constants: 'src/constants.ts',
      $types: 'src/types.ts',
      $ui: 'src/ui',
      $utils: 'src/utils',
      $icons: 'src/icons',
      $components: 'src/components',
      $features: 'src/features',
      $stores: 'src/stores',
      $server: 'src/server',
      $models: 'src/models'
    }
  }
};

export default config;
