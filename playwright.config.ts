import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	// webServer: {
	// 	command: 'npm run build && npm run preview',
	// 	port: 4173
	// },
	testDir: 'tests',
	testMatch: /(.+\.)?(spec)\.[jt]s/,
	use: {
		launchOptions: {
		  slowMo: 500,
		},
	  },	
};

export default config;
