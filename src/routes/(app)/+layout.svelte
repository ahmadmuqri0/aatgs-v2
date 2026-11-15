<script lang="ts">
  import AppSidebar from '#lib/components/app-sidebar.svelte';
  import * as Sidebar from '#lib/components/ui/sidebar/index.ts';
  import * as Breadcrumb from '#lib/components/ui/breadcrumb/index.ts';
  import { Separator } from '#lib/components/ui/separator/index.ts';
  import { page } from '$app/state';
  import { resolve } from '$app/paths';

  let { data, children } = $props();
  const crumbs = $derived(page.data.breadcrumbs!);
</script>

<Sidebar.Provider>
  <AppSidebar user={data.user} />
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2">
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ms-1" />
        <Separator orientation="vertical" class="me-2 data-vertical:h-4 data-vertical:self-auto" />
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {#each crumbs as crumb, i (i)}
              {#if i > 0}<Breadcrumb.Separator />{/if}
              <Breadcrumb.Item>
                {#if crumb.href}
                  <Breadcrumb.Link href={resolve(crumb.href)}>{crumb.label}</Breadcrumb.Link>
                {:else}
                  <Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
                {/if}
              </Breadcrumb.Item>
            {/each}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
