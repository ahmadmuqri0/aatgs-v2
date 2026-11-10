import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Counter from './fixtures/Counter.svelte';

describe('Counter', () => {
	test('renders default props', async () => {
		const screen = render(Counter);

		await expect.element(screen.getByText('Count: 0')).toBeInTheDocument();
	});

	test('renders custom props', async () => {
		const screen = render(Counter, { label: 'Tasks', start: 5 });

		await expect.element(screen.getByText('Tasks: 5')).toBeInTheDocument();
	});

	test('increments on click', async () => {
		const screen = render(Counter);
		const increment = screen.getByRole('button', { name: 'Increment' });

		await increment.click();
		await increment.click();

		await expect.element(screen.getByText('Count: 2')).toBeInTheDocument();
	});

	test('reset is disabled until the count changes', async () => {
		const screen = render(Counter, { start: 3 });
		const reset = screen.getByRole('button', { name: 'Reset' });

		await expect.element(reset).toBeDisabled();

		await screen.getByRole('button', { name: 'Increment' }).click();
		await expect.element(reset).toBeEnabled();

		await reset.click();
		await expect.element(screen.getByText('Count: 3')).toBeInTheDocument();
		await expect.element(reset).toBeDisabled();
	});
});
