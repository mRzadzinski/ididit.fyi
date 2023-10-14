import RegisterLoginForm from '$components/auth/RegisterLoginForm.svelte';
import { afterEach, describe, expect, it as test, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

// Component imports
import { goto } from '$app/navigation';
import { sendEmailLink, loginWithPassword } from '$lib/firebase/auth/emailAuth';
import { registerError, loginError, emailLinkLogin } from '$lib/stores/authStores';

// vi.hoisted - allows to use import in async mock
const { mockLoginError, mockRegisterError, mockEmailLinkLogin } = await vi.hoisted(
	() => import('./vitest/mocks/mock-stores')
);
// like there
vi.mock('$lib/stores/authStores', async () => ({
	registerError: mockRegisterError,
	loginError: mockLoginError,
	emailLinkLogin: mockEmailLinkLogin
}));

vi.mock('$app/navigation.js', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/firebase/auth/emailAuth', () => ({
	sendEmailLink: vi.fn(),
	loginWithPassword: vi.fn()
}));

describe('Test RegisterLoginForm component', () => {
	test('Renders correct form elements', () => {
		const { rerender } = render(RegisterLoginForm, {
			register: false
		});

		const form = screen.getByRole('form');
		const header = screen.getByRole('heading');
		const emailInput = screen.getByLabelText('Email');
		const passwordInput = screen.getByLabelText('Password');
		let buttons = screen.getAllByRole('button');

		expect(form).toBeInTheDocument();
		expect(header).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(buttons).toHaveLength(2);

		rerender({ register: true });

		buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(1);
	});

	test('Elements display correct text', () => {
		const { rerender } = render(RegisterLoginForm, {
			register: false
		});

		let header = screen.getByRole('heading');
		let passwordInput = screen.getByLabelText('Password');
		let forgotPasswordBtn = screen.getByText(/Forgot password?/i);
		let sendFormBtn = screen.getByText('Log In');

		expect(header).toHaveTextContent('Login');
		expect(passwordInput).toBeVisible();
		expect(forgotPasswordBtn).toBeVisible();
		expect(sendFormBtn).toBeInTheDocument();

		rerender({ register: true });

		header = screen.getByRole('heading');
		passwordInput = screen.getByLabelText('Password');
		forgotPasswordBtn = screen.getByText(/Forgot password?/i);
		sendFormBtn = screen.getByRole('button');

		expect(header).toHaveTextContent('Register');
		expect(passwordInput).not.toBeVisible();
		expect(forgotPasswordBtn).not.toBeVisible();
		expect(sendFormBtn).toHaveTextContent('Register');
	});
});
