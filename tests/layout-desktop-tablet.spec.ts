import { test, expect } from '@playwright/test';
import { loginWithEmailAndPassword } from './helpers';

const email = 'orange.otter.966@example.com';
const password = 'LjA43iXderUhpkg';
// const userUID = 'yP2rYrmayId1laFevRDg2cD1401k';

test.beforeEach(async ({ page }) => {
	await loginWithEmailAndPassword(page, email, password);
});

test('render all elements', async ({ page }) => {
	await expect(page.getByRole('button', { name: 'ididit.fyi', exact: true })).toBeVisible();
	await expect(page.getByPlaceholder('Search...')).toBeVisible();
	await expect(page.locator('#avatar-nav-dropdown')).toBeVisible();
	await expect(
		page
			.locator('ul')
			.filter({ hasText: /^Daily Review Seeds Goals$/ })
			.getByRole('button')
	).toBeVisible();
	await expect(page.getByRole('link', { name: 'Seeds' }).first()).toBeInViewport();
	await expect(page.getByRole('link', { name: 'Goals' }).first()).toBeInViewport();
	await expect(page.getByLabel('open sidebar')).not.toBeVisible();
});
