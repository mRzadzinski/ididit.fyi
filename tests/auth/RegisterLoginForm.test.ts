import RegisterLoginForm from '$components/auth/RegisterLoginForm.svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
// Component imports
import { goto } from '$app/navigation';
import { sendEmailLink, loginWithPassword } from '$lib/firebase/auth/emailAuth';
import { registerError, loginError, emailLinkLogin } from '$lib/stores/authStores';
import ErrorMessage from '$components/ErrorMessage.svelte';
// Mock imports
const { mockLoginError, mockRegisterError, mockEmailLinkLogin } = await vi.hoisted(
	() => import('./mocks/mock-stores')
);
const ErrorMessageMock = await vi.hoisted(() => import('./mocks/ErrorMessageMock.svelte'));

vi.mock('$app/navigation.js', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/firebase/auth/emailAuth', () => ({
	sendEmailLink: vi.fn(),
	loginWithPassword: vi.fn()
}));

vi.mock('$lib/stores/authStores', async () => {
	return {
		registerError: mockRegisterError,
		loginError: mockLoginError,
		emailLinkLogin: mockEmailLinkLogin
	};
});

vi.mock('$components/ErrorMessage.svelte', async () => ({
	default: ErrorMessageMock
}));

describe('Test RegisterLoginForm component', () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	it('Renders correct form elements', () => {
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

	it('Reactive elements display correct text', () => {
		const { rerender } = render(RegisterLoginForm, {
			register: false
		});

		let header = screen.getByRole('heading');
		let forgotPasswordBtn = screen.getByText(/Forgot password?/i);
		const buttons = screen
			.getAllByRole('button')
			.filter((btn) => btn.innerHTML.includes('Log In'));
		let sendFormBtn = buttons[0];

		expect(header).toHaveTextContent('Login');
		expect(forgotPasswordBtn).toBeInTheDocument();
		expect(sendFormBtn).toBeInTheDocument();

		rerender({ register: true });

		header = screen.getByRole('heading');
		forgotPasswordBtn = screen.getByText(/Forgot password?/i);
		sendFormBtn = screen.getByRole('button');

		expect(header).toHaveTextContent('Register');
		expect(forgotPasswordBtn).not.toBeVisible();
		expect(sendFormBtn).toHaveTextContent('Register');
	});
});
