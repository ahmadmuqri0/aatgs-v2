<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import { ModeWatcher } from 'mode-watcher';

  import favicon from '#lib/assets/favicon.svg';

  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{page.data.title} &bull; AATGS</title>
</svelte:head>

<ModeWatcher />
{@render children()}
