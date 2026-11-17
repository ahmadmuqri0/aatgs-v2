<script lang="ts">
  import * as Dialog from '#lib/components/ui/dialog/index.ts';
  import { Button } from '#lib/components/ui/button/index.ts';
  import { PlusIcon } from '@lucide/svelte';

  // let form = $props();
  let open = $state(false);
</script>

<Dialog.Root
  bind:open
  onOpenChangeComplete={(isOpen) => {
    if (!isOpen) console.log('reset form');
  }}
>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...props}>
        <PlusIcon data-icon="inline-start" />
        New Assignment
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>New assignment</Dialog.Title>
      <Dialog.Description>
        Upload your assignment brief and we&apos;ll break it into tasks.
      </Dialog.Description>
    </Dialog.Header>
    <!-- <form method="POST" use:enhance></form> -->
  </Dialog.Content>
</Dialog.Root>
