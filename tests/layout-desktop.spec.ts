import { test, expect } from '@playwright/test';
import { loginWithEmailAndPassword } from './helpers';

const email = 'orange.otter.966@example.com';
const password = 'LjA43iXderUhpkg';
// const userUID = 'yP2rYrmayId1laFevRDg2cD1401k';

test.beforeEach(async ({ page }) => {
	loginWithEmailAndPassword(page, email, password);
});

test.describe('Test app layout', () => {
	test('my test', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'ididit.fyi', exact: true })).toBeVisible();
		await expect(page.getByPlaceholder('Search...')).toBeVisible();
		await expect(page.locator('#avatar-nav-dropdown')).toBeVisible();
		await expect(page.locator('ul').filter({ hasText: /^Daily Review Seeds Goals$/ }).getByRole('button')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Seeds' }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: 'Goals' }).first()).toBeVisible();
		// await expect(page.).toBeVisible();
	});


});
