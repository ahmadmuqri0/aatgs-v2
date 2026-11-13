import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '../src/routes/(app)/+page.svelte';

describe('/+page.svelte', () => {
  test('renders the h1 heading', async () => {
    const screen = render(Page);

    await expect.element(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  test('links to the SvelteKit docs', async () => {
    const screen = render(Page);

    await expect
      .element(screen.getByRole('link'))
      .toHaveAttribute('href', 'https://svelte.dev/docs/kit');
  });
});
