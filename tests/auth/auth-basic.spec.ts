import { test, expect, type Page } from '@playwright/test';
import { getFirebaseAuthLink, generateRandomEmail, generateRandomPassword } from './helpers';

let email: string;
let password: string;
let emailLink: string;

async function registerWithLink(page: Page) {
	// Register and set password
	await page.goto('http://127.0.0.1:5000/auth/register');
	// Fill email and click register
	email = generateRandomEmail();
	await page.getByPlaceholder('email').fill(email);
	await page.getByRole('button', { name: 'Register', exact: true }).click();
	// Show link-sent page
	await expect(page).toHaveURL('http://127.0.0.1:5000/auth/link-sent');
	// Go to received url
	emailLink = await getFirebaseAuthLink();
	await page.goto(emailLink);
	// Show set-password page for first login
	await expect(page).toHaveURL('http://127.0.0.1:5000/auth/set-password');
	// Set new password
	password = generateRandomPassword(15);
	await page.getByPlaceholder('password', { exact: true }).fill(password);
	await page.getByPlaceholder('confirm password', { exact: true }).fill(password);
	await page.getByRole('button', { name: 'Save', exact: true }).click();
	// Show set-password confirmation
	await expect(page.getByText('New password saved', { exact: true })).toBeVisible();
	// Click Go to app btn
	await page.getByRole('button', { name: 'Go to App', exact: true }).click();
	// Log out -> Redirect to auth/login
	await page.getByRole('button', { name: 'Log Out', exact: true }).click();
}

async function loginWithEmailAndPassword(page: Page) {
	await page.getByPlaceholder('email').fill(email);
	await page.getByPlaceholder('password', { exact: true }).fill(password);
	await page.getByRole('button', { name: 'Log In', exact: true }).click();
}

test.describe('Test auth', () => {
	test('Render login/register elements', async ({
		page
	}) => {
		await page.goto('http://127.0.0.1:5000/auth/login');
		// Check main login page
		await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
		await expect(page.getByPlaceholder('email')).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Password' })).toBeVisible();
		await expect(page.getByText('Password', { exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Forgot password?', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Log In', exact: true })).toBeVisible();
		await expect(page.getByText('OR', { exact: true })).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Login with email link', exact: true })
		).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Login with Google', exact: true })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Register', exact: true })).toBeVisible();
		// not
		await expect(
			page.getByRole('button', { name: 'Login with email and password', exact: true })
		).not.toBeVisible();

		// Go to register page
		await page.getByRole('button', { name: 'Register', exact: true }).click();
		await expect(page.getByRole('heading', { name: 'Register', exact: true })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
		await expect(page.getByPlaceholder('email')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Register', exact: true })).toBeVisible();
		await expect(page.getByText('OR', { exact: true })).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Register with Google', exact: true })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
		// not
		await expect(page.locator('label').filter({ hasText: 'Password' })).not.toBeVisible();
		await expect(page.getByText('Password', { exact: true })).not.toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Forgot password?', exact: true })
		).not.toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Login with email link', exact: true })
		).not.toBeVisible();

		// Go back to main login page
		await page.getByRole('button', { name: 'Login', exact: true }).click();
		// Go to Login with email link
		await page.getByRole('button', { name: 'Login with email link', exact: true }).click();
		await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
		await expect(page.getByPlaceholder('email')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Log In', exact: true })).toBeVisible();
		await expect(page.getByText('OR', { exact: true })).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Login with email and password', exact: true })
		).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Login with Google', exact: true })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Register', exact: true })).toBeVisible();
		// not
		await expect(page.locator('label').filter({ hasText: 'Password' })).not.toBeVisible();
		await expect(page.getByText('Password', { exact: true })).not.toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Forgot password?', exact: true })
		).not.toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Login with email link', exact: true })
		).not.toBeVisible();

		// Go back to main login page
		await page.getByRole('button', { name: 'Login with email and password', exact: true }).click();
		// Check forgot password link
		await page.getByRole('button', { name: 'Forgot password?', exact: true }).click();

		await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Login with email and password', exact: true })
		).toBeVisible();
		await expect(page.getByText('Password', { exact: true })).not.toBeVisible();
	});

	test('Test form validation', async ({ page }) => {
		await page.goto('http://127.0.0.1:5000/auth/login');
		// Email input
		// empty
		await expect(page.locator('input[type="email"][required]:invalid')).toBeVisible();
		// wrong format
		await page.getByPlaceholder('email').fill('only-left-side');
		await expect(page.locator('input[type="email"][required]:invalid')).toBeVisible();
		await page.getByPlaceholder('email').fill('@only-right');
		await expect(page.locator('input[type="email"][required]:invalid')).toBeVisible();
		await page.getByPlaceholder('email').fill('@');
		await expect(page.locator('input[type="email"][required]:invalid')).toBeVisible();
		// correct format
		await page.getByPlaceholder('email').fill('left@right');
		await expect(page.locator('input[type="email"][required]:valid')).toBeVisible();
		await page.getByPlaceholder('email').fill(generateRandomEmail());
		await expect(page.locator('input[type="email"][required]:valid')).toBeVisible();

		// Password input (requirement: min 12, max 128 characters)
		// empty
		await expect(page.locator('input[type="password"][required]:invalid')).toBeVisible();
		// too short
		await page.getByPlaceholder('password').fill(generateRandomPassword(1));
		await expect(page.locator('input[type="password"][required]:invalid')).toBeVisible();
		await page.getByPlaceholder('password').fill(generateRandomPassword(5));
		await expect(page.locator('input[type="password"][required]:invalid')).toBeVisible();
		await page.getByPlaceholder('password').fill(generateRandomPassword(11));
		await expect(page.locator('input[type="password"][required]:invalid')).toBeVisible();
		// correct
		await page.getByPlaceholder('password').fill(generateRandomPassword(13));
		await expect(page.locator('input[type="password"][required]:valid')).toBeVisible();
		await page.getByPlaceholder('password').fill(generateRandomPassword(56));
		await expect(page.locator('input[type="password"][required]:valid')).toBeVisible();
		await page.getByPlaceholder('password').fill(generateRandomPassword(127));
		await expect(page.locator('input[type="password"][required]:valid')).toBeVisible();
	});

	test('Register/login with email link', async ({ page }) => {
		// Register
		await page.goto('http://127.0.0.1:5000/auth/register');
		// Fill email and click register
		email = generateRandomEmail();
		await page.getByPlaceholder('email').fill(email);
		await page.getByRole('button', { name: 'Register', exact: true }).click();
		// Show link-sent page
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/link-sent');
		await expect(page.getByText('Check your email', { exact: true })).toBeVisible();
		await expect(
			page.getByText('Link usually arrives immediately, but it may take several minutes.', {
				exact: true
			})
		).toBeVisible();
		// Go to received url
		emailLink = await getFirebaseAuthLink();
		await page.goto(emailLink);
		// Show set-password page for first login
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/set-password');
		// Render set-password page correctly
		await expect(page.getByRole('heading', { name: 'Set password', exact: true })).toBeVisible();
		await expect(page.getByText('optional', { exact: true })).toBeVisible();
		await expect(
			page.getByText('Enables login with email and password', { exact: true })
		).toBeVisible();
		await expect(page.getByText('Email', { exact: true })).toBeVisible();
		await expect(page.locator('input[type="email"]:disabled')).toBeVisible();
		await expect(page.getByText('Password', { exact: true })).toBeVisible();
		await expect(page.getByPlaceholder('password', { exact: true })).toBeVisible();
		await expect(page.getByText('Confirm password', { exact: true })).toBeVisible();
		await expect(page.getByPlaceholder('confirm password', { exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Do it later in settings', exact: true })
		).toBeVisible();
		// Set new password
		password = generateRandomPassword(36);
		await page.getByPlaceholder('password', { exact: true }).fill(password);
		await page.getByPlaceholder('confirm password', { exact: true }).fill(password);
		await page.getByRole('button', { name: 'Save', exact: true }).click();
		// Show set-password confirmation
		await expect(page.getByText('New password saved', { exact: true })).toBeVisible();
		// Click Go to app btn
		await page.getByRole('button', { name: 'Go to App', exact: true }).click();
		// Log out -> Redirect to auth/login
		await page.getByRole('button', { name: 'Log Out', exact: true }).click();
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');

		// Login with email link
		await page.getByRole('button', { name: 'Login with email link', exact: true }).click();
		await page.getByPlaceholder('email').fill(email);
		await page.getByRole('button', { name: 'Log In', exact: true }).click();
		// Show link-sent page
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/link-sent');
		// Go to received url
		emailLink = await getFirebaseAuthLink();
		await page.goto(emailLink);
		// Show App page for second login, not set-password
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
		await page.getByRole('button', { name: 'Log Out', exact: true }).click();

		// 'Set password later' button on set-password page works
		// Create new account with email link
		await page.getByRole('button', { name: 'Login with email link', exact: true }).click();
		email = generateRandomEmail();
		await page.getByPlaceholder('email').fill(email);
		await page.getByRole('button', { name: 'Log In', exact: true }).click();
		// Go to received url
		emailLink = await getFirebaseAuthLink();
		await page.goto(emailLink);
		// Show set-password page for first login
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/set-password');
		// Click do it later in settings
		await page.getByRole('button', { name: 'Do it later in settings', exact: true }).click();
		// Redirect to app page
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
		await page.getByRole('button', { name: 'Log Out', exact: true }).click();

		// Show 'link inactive' message for used link
		// Go to used url
		await page.goto(emailLink);
		// Enter email (no email in local storage after sending link)
		await page.getByPlaceholder('email').fill(email);
		await page.getByRole('button', { name: 'Log In', exact: true }).click();
		// Show 'link inactive' message
		await expect(page.getByText('Link inactive. Go to login page.', { exact: true })).toBeVisible();
		await page.getByRole('button', { name: 'Login', exact: true }).click();
		// Redirect to auth/login
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');
	});

	test('Register/login with Google', async ({ page }) => {
		// Register
		await page.goto('http://127.0.0.1:5000/auth/register');
		// Click Register with Google
		page.getByRole('button', { name: 'Register with Google', exact: true }).click();
		// Hard wait for google form, otherwise it doesn't record playwright actions
		await page.waitForTimeout(1000);
		// Click add new account
		page.getByRole('button', { name: 'Add new account', exact: true }).click();
		await page.waitForTimeout(1000);
		// Fill the form and confirm
		page.getByRole('button', { name: 'Auto-generate user information', exact: true }).click();
		await page.waitForTimeout(1000);
		// Get auto generated user info
		email = await page.locator('#email-input').inputValue();
		page.getByRole('button', { name: 'Sign in with Google.com', exact: true }).click();
		// Show set-password page for first login
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/set-password');
		// Log out
		await page.goto('http://127.0.0.1:5000/auth/logout');

		// Login
		await page.goto('http://127.0.0.1:5000/auth/login');
		page.getByRole('button', { name: 'Login with Google', exact: true }).click();
		await page.waitForTimeout(1500);
		// Choose google account
		await page.getByText(email, { exact: true }).click();
		// On second login go to app
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
	});

	test('Login with email and password', async ({ page }) => {
		await registerWithLink(page);

		// Login with email and password
		// Wrong credentials
		await page.getByPlaceholder('email').fill('so@wrong');
		await page.getByPlaceholder('password', { exact: true }).fill(generateRandomPassword(17));
		await page.getByRole('button', { name: 'Log In', exact: true }).click();
		await expect(page.getByText('error')).toBeVisible();

		await page.getByPlaceholder('email').fill('ooops@again');
		await page.getByPlaceholder('password', { exact: true }).fill(generateRandomPassword(12));
		await page.getByRole('button', { name: 'Log In', exact: true }).click();
		await expect(page.getByText('error')).toBeVisible();

		await page.getByPlaceholder('email').fill('moooo@mooooooo.meadow');
		await page.getByPlaceholder('password', { exact: true }).fill(generateRandomPassword(22));
		await page.getByRole('button', { name: 'Log In', exact: true }).click();
		await expect(page.getByText('error')).toBeVisible();

		// Correct credentials
		await page.getByPlaceholder('email').fill(email);
		await page.getByPlaceholder('password', { exact: true }).fill(password);
		await page.getByRole('button', { name: 'Log In', exact: true }).click();
		await expect(page.getByText('error')).not.toBeVisible();
		// Redirect to app
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
	});

	test('Redirects: logged in / out, correct url navigation', async ({ page }) => {
		await registerWithLink(page);

		// Logged out
		// Go to /, redirect to auth/login
		await page.goto('http://127.0.0.1:5000/');
		await page.getByRole('button', { name: 'Go to App', exact: true }).click();
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');
		// Go to /app, redirect to auth/login
		await page.goto('http://127.0.0.1:5000/app');
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');
		// Go to auth/set-password, redirect to auth/login
		await page.goto('http://127.0.0.1:5000/auth/set-password');
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');
		// Go to /auth, redirect to auth/login
		await page.goto('http://127.0.0.1:5000/auth');
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');
		// Go to auth/logout, redirect to auth/login
		await page.goto('http://127.0.0.1:5000/auth/logout');
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');

		// Logged in
		await loginWithEmailAndPassword(page);
		// Go to /, redirect to /app
		await page.goto('http://127.0.0.1:5000/');
		await page.getByRole('button', { name: 'Go to App', exact: true }).click();
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
		// Go to /auth, redirect to /app
		await page.goto('http://127.0.0.1:5000/auth');
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
		// Go to /auth/login, redirect to /app
		await page.goto('http://127.0.0.1:5000/auth/login');
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
		// Go to /auth/login-with-google, redirect to /app
		await page.goto('http://127.0.0.1:5000/auth/login-with-google');
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
		// Go to /auth/register, redirect to /app
		await page.goto('http://127.0.0.1:5000/auth/register');
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
		// Go to /auth/link-sent, redirect to /app
		await page.goto('http://127.0.0.1:5000/auth/link-sent');
		await expect(page).toHaveURL('http://127.0.0.1:5000/app');
		
		// Go to /auth/login-with-link
		await page.goto('http://127.0.0.1:5000/auth/login-with-link');
		await expect(page.getByText('Link inactive. Go to login page.', { exact: true })).toBeVisible();
		// Click Login button, redirect to auth/login
		await page.getByRole('button', { name: 'Login', exact: true }).click();
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');

		await loginWithEmailAndPassword(page);

		// Go to auth/logout, redirect to auth/login
		await page.goto('http://127.0.0.1:5000/auth/logout');
		await expect(page).toHaveURL('http://127.0.0.1:5000/auth/login');
	});
});
