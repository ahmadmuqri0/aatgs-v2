<script lang="ts">
  import type { User } from 'better-auth';

  import { ChevronsUpDownIcon, LogOutIcon, Settings2Icon } from '@lucide/svelte';

  import * as Avatar from '#lib/components/ui/avatar/index.ts';
  import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.ts';
  import * as Sidebar from '#lib/components/ui/sidebar/index.ts';
  import { useSidebar } from '#lib/components/ui/sidebar/index.ts';
  import { getInitials } from '#lib/initials.ts';
  import { logout } from '#lib/remotes/auth.remote.ts';

  let { user }: { user: User } = $props();

  const sidebar = useSidebar();
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            {...props}
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar.Root class="size-8 rounded-lg">
              <Avatar.Image src={user.image} alt={user.name} />
              <Avatar.Fallback class="rounded-lg">{getInitials(user.name)}</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-start text-sm leading-tight">
              <span class="truncate font-medium">{user.name}</span>
              <span class="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon class="ms-auto size-4" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
            <Avatar.Root class="size-8 rounded-lg">
              <Avatar.Image src={user.image} alt={user.name} />
              <Avatar.Fallback class="rounded-lg">{getInitials(user.name)}</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-start text-sm leading-tight">
              <span class="truncate font-medium">{user.name}</span>
              <span class="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <Settings2Icon />
            Settings
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive">
          {#snippet child({ props })}
            <form {...logout}>
              <button {...props} type="submit" class={[props.class, 'w-full cursor-pointer']}>
                <LogOutIcon />
                Log out
              </button>
            </form>
          {/snippet}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
