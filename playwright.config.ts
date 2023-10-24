import type { PlaywrightTestConfig } from '@playwright/test';
// import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: /(.+\.)?(spec)\.[jt]s/,
	use: {
		launchOptions: {
		  slowMo: 500,
		},
	  },
};

export default config;
