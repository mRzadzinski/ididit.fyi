import { test, expect } from '@playwright/test';

let email: string;
let password: string;
let emailLink: string;

test.describe('Test auth', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://127.0.0.1:5000/auth/login');
	});

	test('Render /auth/login elements', async ({ page }) => {
		// Check main login page
		await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Email' })).toBeInViewport();
		await expect(page.getByPlaceholder('email')).toBeInViewport();
		await expect(page.locator('label').filter({ hasText: 'Password' })).toBeInViewport();
		await expect(page.getByText('Password', { exact: true })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Forgot password?' })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Log In' })).toBeInViewport();
		await expect(page.getByText('OR', { exact: true })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Login with email link' })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Login with Google' })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Register' })).toBeInViewport();

		// Go to register page
		await page.getByRole('button', { name: 'Register' }).click();

		await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Email' })).toBeInViewport();
		await expect(page.getByPlaceholder('email')).toBeInViewport();
		await expect(page.locator('label').filter({ hasText: 'Password' })).not.toBeInViewport();
		await expect(page.getByText('Password', { exact: true })).not.toBeInViewport();
		await expect(page.getByRole('button', { name: 'Forgot password?' })).not.toBeInViewport();
		await expect(page.getByRole('button', { name: 'Register', exact: true })).toBeInViewport();
		await expect(page.getByText('OR', { exact: true })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Login with email link' })).not.toBeInViewport();
		await expect(page.getByRole('button', { name: 'Register with Google' })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Login' })).toBeInViewport();

		// Go back to main login page
		await page.getByRole('button', { name: 'Login' }).click();
		// Go to Login with email link
		await page.getByRole('button', { name: 'Login with email link' }).click();

		await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Email' })).toBeInViewport();
		await expect(page.getByPlaceholder('email')).toBeInViewport();
		await expect(page.locator('label').filter({ hasText: 'Password' })).not.toBeInViewport();
		await expect(page.getByText('Password', { exact: true })).not.toBeInViewport();
		await expect(page.getByRole('button', { name: 'Forgot password?' })).not.toBeInViewport();
		await expect(page.getByRole('button', { name: 'Log In' })).toBeInViewport();
		await expect(page.getByText('OR', { exact: true })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Login with email link' })).not.toBeInViewport();
		await expect(
			page.getByRole('button', { name: 'Login with email and password' })
		).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Login with Google' })).toBeInViewport();
		await expect(page.getByRole('button', { name: 'Register' })).toBeInViewport();

		// Go back to main login page
		await page.getByRole('button', { name: 'Login with email and password' }).click();
	});

	test('Test form validation', async ({ page }) => {
		await expect(page.locator('input[type="email"][required]:invalid')).toBeInViewport();
	});
});
