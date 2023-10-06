import ToggleSignUp__SvelteComponent_ from '../../src/components/auth/ToggleSignUp.svelte';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('Test ToggleSignUp component', () => {
	it('Render button', async () => {
		render(ToggleSignUp__SvelteComponent_, { signUp: false, toggleSignUp: () => {} });

		const btn = screen.getByRole('button');

		expect(btn).toBeInTheDocument();
	});

	it('Call toggleSignUp function on button click', async () => {
		const user = userEvent.setup();
		const toggleSignUp = vi.fn(() => {});

		render(ToggleSignUp__SvelteComponent_, { signUp: true, toggleSignUp: toggleSignUp });

		const btn = screen.getByRole('button');
		await user.click(btn);
		await user.click(btn);
		await user.click(btn);

		expect(toggleSignUp).toHaveBeenCalledTimes(3);
	});

	it('Display appropriate text', async () => {
		const { rerender } = render(ToggleSignUp__SvelteComponent_, {
			signUp: false,
			toggleSignUp: () => {}
		});

		let btn = screen.getByRole('button');
		expect(btn).toHaveTextContent(/Need account?/i);

		rerender({
			signUp: true,
			toggleSignUp: () => {}
		});

		btn = screen.getByRole('button');
		expect(btn).toHaveTextContent(/Go to login/i);
	});
});
