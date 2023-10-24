import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: /(.+\.)?(spec)\.[jt]s/,
	use: {
		launchOptions: {
			slowMo: 500
		}
	},
	projects: [
		{
			name: 'Default',
		},
		// Auth
		{
			name: 'auth-desktop',
			testMatch: /.auth.spec.ts/,
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1440, height: 789 }
			}
		},
		{
			name: 'auth-tablet',
			testMatch: /.auth.spec.ts/,
			use: {
				viewport: { width: 768, height: 1024 },
				isMobile: true
			}
		},
		{
			name: 'auth-mobile',
			testMatch: /.auth.spec.ts/,
			use: {
				viewport: { width: 320, height: 568 },
				isMobile: true
			}
		}
	]
};

export default config;
