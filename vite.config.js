import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit({
			experimental: {
				prebundleSvelteLibraries: true
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	experimental: {
		prebundleSvelteLibraries: true
	}
};

export default config;
