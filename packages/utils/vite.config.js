

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		'import.meta.vitest': 'undefined',
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}']
	},
};

export default config;
