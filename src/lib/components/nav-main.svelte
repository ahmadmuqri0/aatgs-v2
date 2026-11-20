<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import type { NavItem } from '#lib/types.ts';

  import * as Sidebar from '#lib/components/ui/sidebar/index.ts';

  let { items }: { items: NavItem[] } = $props();
</script>

<Sidebar.Group>
  <Sidebar.GroupLabel>General</Sidebar.GroupLabel>
  <Sidebar.Menu>
    {#each items as item (item.title)}
      {@const href = resolve(item.url)}
      <Sidebar.MenuItem>
        <Sidebar.MenuButton
          tooltipContent={item.title}
          isActive={page.url.pathname === href || page.url.pathname.startsWith(href + '/')}
        >
          {#snippet child({ props })}
            <a {href} {...props}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    {/each}
  </Sidebar.Menu>
</Sidebar.Group>
