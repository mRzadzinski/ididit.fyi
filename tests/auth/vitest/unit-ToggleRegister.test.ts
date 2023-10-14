import ToggleRegister from '$components/auth/ToggleRegister.svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
// Component imports
import { goto } from '$app/navigation';
import { loginError, registerError } from '$lib/stores/authStores';

vi.mock('$app/navigation.js', () => ({
	goto: vi.fn()
}));

const { mockLoginError, mockRegisterError } = await vi.hoisted(
	() => import('./vitest/mocks/mock-stores')
);
vi.mock('$lib/stores/authStores', async () => {
	return {
		loginError: mockLoginError,
		registerError: mockRegisterError
	};
});

describe('Test ToggleRegister component', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	test('Render button with correct text', async () => {
		const { rerender } = render(ToggleRegister, {
			register: false
		});

		let btn = screen.getByRole('button');
		expect(btn).toHaveTextContent(/Register/i);

		rerender({
			register: true
		});

		btn = screen.getByRole('button');
		expect(btn).toHaveTextContent(/Login/i);
	});

	test('Call functions correctly on button click', async () => {
		const user = userEvent.setup();

		const { rerender } = render(ToggleRegister, {
			register: false
		});

		let btn = screen.getByRole('button');

		await user.click(btn);
		await user.click(btn);
		await user.click(btn);

		expect(goto).toHaveBeenCalledTimes(3);
		expect(goto).toHaveBeenCalledWith('/auth/register');
		expect(loginError.set).toHaveBeenCalledWith('');
		expect(registerError.set).not.toHaveBeenCalled();

		vi.clearAllMocks();
		rerender({
			register: true
		});

		btn = screen.getByRole('button');
		await user.click(btn);
		await user.click(btn);

		expect(goto).toHaveBeenCalledTimes(2);
		expect(goto).toHaveBeenCalledWith('/auth/login');
		expect(registerError.set).toHaveBeenCalledWith('');
		expect(loginError.set).not.toHaveBeenCalled();
	});
});
