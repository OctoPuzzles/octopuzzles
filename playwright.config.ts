import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	globalSetup: './tests/setup/authedSetup',
	use: {
		// Tell all tests to load signed-in state from 'storageState.json'.
		storageState: './tests/setup/storageState.json'
	}
};

export default config;
