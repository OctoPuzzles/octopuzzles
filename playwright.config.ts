import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	globalSetup: './tests/testUtils/authedSetup',
	use: {
		// Tell all tests to load signed-in state from 'storageState.json'.
		storageState: 'storageState.json'
	}
};

export default config;
