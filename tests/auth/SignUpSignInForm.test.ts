import SignUpSignInForm__SvelteComponent_ from '../../src/components/auth/RegisterLoginForm.svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

import { goto } from '$app/navigation';
import { sendEmailLink, signInWithPassword } from '$lib/firebase/auth/emailAuth';
import { signUpError, signInError } from '$lib/stores/firebaseErrors';
import ErrorMessage__SvelteComponent_ from '../../src/components/ErrorMessage.svelte';

vi.mock('$app/navigation', () => {
	const goto = vi.fn();

	return { goto };
});

describe('Test SignUpSignInForm component', () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	it('Renders correct form elements', () => {
		const { rerender } = render(SignUpSignInForm__SvelteComponent_, {
			register: false,
			emailLinkSignIn: false,
			toggleEmailSignIn: () => {}
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

		rerender({ register: true, emailLinkSignIn: false, toggleEmailSignIn: () => {} });

		buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(1);
	});

	it('Reactive elements display correct text', () => {
		const { rerender } = render(SignUpSignInForm__SvelteComponent_, {
			register: false,
			emailLinkSignIn: false,
			toggleEmailSignIn: () => {}
		});

		let header = screen.getByRole('heading');
		let forgotPasswordBtn = screen.getByText(/Forgot password?/i);
		const buttons = screen
			.getAllByRole('button')
			.filter((btn) => btn.innerHTML.includes('Sign in'));
		let sendFormBtn = buttons[0];

		expect(header).toHaveTextContent('Sign in');
		expect(forgotPasswordBtn).toBeInTheDocument();
		expect(sendFormBtn).toBeInTheDocument();

		rerender({ register: true, emailLinkSignIn: false, toggleEmailSignIn: () => {} });

		header = screen.getByRole('heading');
		forgotPasswordBtn = screen.getByText(/Forgot password?/i);
		sendFormBtn = screen.getByRole('button');

		expect(header).toHaveTextContent('Sign up');
		expect(forgotPasswordBtn).not.toBeVisible();
		expect(sendFormBtn).toHaveTextContent('Sign up');
	});
});
