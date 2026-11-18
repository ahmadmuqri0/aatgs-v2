<script lang="ts">
  import { BookOpenIcon, CommandIcon } from '@lucide/svelte';
  import * as Sidebar from '#lib/components/ui/sidebar/index.ts';
  import NavMain from './nav-main.svelte';
  import NavUser from './nav-user.svelte';
  import type { ComponentProps } from 'svelte';
  import type { NavItem } from '#lib/types.ts';
  import type { User } from 'better-auth';
  import { resolve } from '$app/paths';
  let {
    ref = $bindable(null),
    user,
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & { user: User } = $props();

  const navItem = [
    { title: 'Assignment', url: 'assignments', icon: BookOpenIcon }
  ] satisfies NavItem[];
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg">
          {#snippet child({ props })}
            <a href="/" {...props}>
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <CommandIcon class="size-4" />
              </div>
              <div class="grid flex-1 text-start text-sm leading-tight">
                <span class="truncate font-medium">AATGS</span>
                <span class="truncate text-xs"> Automated Assignment Task Generation System </span>
              </div>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain items={navItem} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser {user} />
  </Sidebar.Footer>
</Sidebar.Root>
