import LogSignForm__SvelteComponent_ from '../../src/routes/components/login/LogSignForm.svelte';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

describe('Test LogSignForm__SvelteComponent_ component', () => {
	it('Renders correct form elements', () => {
		const { rerender } = render(LogSignForm__SvelteComponent_, { signUp: false });

		const header = screen.getByRole('heading');
		const emailInput = screen.getByLabelText('Email');
		const passwordInput = screen.getByLabelText('Password');
		let buttons = screen.getAllByRole('button');

		expect(header).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(buttons).toHaveLength(2);

		rerender({ signUp: true });

		buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(1);
	});

	it('Reactive elements display correct text', () => {
		const { rerender } = render(LogSignForm__SvelteComponent_, { signUp: false });

		let header = screen.getByRole('heading');
		let forgotPasswordBtn = screen.getByText(/Forgot password?/i);
		const buttons = screen.getAllByRole('button').filter((btn) => btn.innerHTML === 'Login');
		let sendFormBtn = buttons[0];

		expect(header).toHaveTextContent('Login');
		expect(forgotPasswordBtn).toBeInTheDocument();
		expect(sendFormBtn).toBeInTheDocument();

		rerender({ signUp: true });

		header = screen.getByRole('heading');
		forgotPasswordBtn = screen.getByText(/Forgot password?/i);
		sendFormBtn = screen.getByRole('button');

		expect(header).toHaveTextContent('Sign up');
		expect(forgotPasswordBtn).not.toBeVisible();
		expect(sendFormBtn).toHaveTextContent('Sign up');
	});
});
