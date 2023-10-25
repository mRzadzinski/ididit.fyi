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
	await expect(page.getByPlaceholder('Search...')).not.toBeVisible();
	await expect(page.getByAltText('avatar-nav-dropdown')).not.toBeVisible();
	await expect(
		page
			.locator('ul')
			.filter({ hasText: /^Daily Review Seeds Goals$/ })
			.getByRole('button')
	).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'avatar', exact: true })).not.toBeInViewport();
    await expect(page.getByRole('button', { name: 'Daily Review' })).not.toBeInViewport();
	await expect(page.getByRole('link', { name: 'Seeds' }).first()).not.toBeInViewport();
	await expect(page.getByRole('link', { name: 'Goals' }).first()).not.toBeInViewport();
	await expect(page.getByLabel('open sidebar')).toBeVisible();

	// Open sidebar
	await page.getByLabel('open sidebar').click();

	await expect(page.getByRole('button', { name: 'avatar', exact: true })).toBeInViewport();
	await expect(page.getByRole('button', { name: 'Daily Review' })).toBeInViewport();
	await expect(page.getByRole('link', { name: 'Seeds' }).first()).toBeInViewport();
	await expect(page.getByRole('link', { name: 'Goals' }).first()).toBeInViewport();

	// Close sidebar by clicking outside of it
    await page.mouse.click(300, 50);

    await expect(page.getByRole('button', { name: 'avatar', exact: true })).not.toBeInViewport();
    await expect(page.getByRole('button', { name: 'Daily Review' })).not.toBeInViewport();
	await expect(page.getByRole('link', { name: 'Seeds' }).first()).not.toBeInViewport();
	await expect(page.getByRole('link', { name: 'Goals' }).first()).not.toBeInViewport();
});
