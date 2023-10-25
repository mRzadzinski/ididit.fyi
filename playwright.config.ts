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
			name: 'Default'
		},
		{
			name: 'desktop',
			testMatch: /.*(all|desktop).*.spec.ts/,
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1440, height: 789 }
			}
		},
		{
			name: 'tablet',
			testMatch: /.*(all|tablet).*.spec.ts/,
			use: {
				viewport: { width: 768, height: 1024 },
				isMobile: true
			}
		},
		{
			name: 'mobile',
			testMatch: /.*(all|mobile).*.spec.ts/,
			use: {
				viewport: { width: 320, height: 568 },
				isMobile: true
			}
		}
	]
};

export default config;
