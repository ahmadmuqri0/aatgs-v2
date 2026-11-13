<script lang="ts">
  import './layout.css';
  import favicon from '#lib/assets/favicon.svg';
  import { ModeWatcher } from 'mode-watcher';
  import type { LayoutProps } from './$types';
  import { page } from '$app/state';

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{page.data.title} &bull; AATGS</title>
</svelte:head>

<ModeWatcher />
{@render children()}
