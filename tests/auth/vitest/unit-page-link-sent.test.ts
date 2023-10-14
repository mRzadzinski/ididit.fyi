import LinkSentPage from '../../../src/routes/auth/link-sent/+page@.svelte';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

describe('Test link-sent page', () => {
	test('Renders correct text', () => {
		render(LinkSentPage);

		const heading1 = screen.getByText('Check your email');
		const heading4 = screen.getByText(
			'Link usually arrives immediately, but it may take several minutes.'
		);

		expect(heading1).toBeInTheDocument();
		expect(heading4).toBeInTheDocument();
	});
});
