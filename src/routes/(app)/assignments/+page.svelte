<script lang="ts">
  import * as Empty from '#lib/components/ui/empty/index.ts';
  import { Button } from '#lib/components/ui/button/index.ts';
  import { FileTextIcon } from '@lucide/svelte';
  import { getAssignments } from '#lib/remotes/assignment.remote.ts';

  const assignments = $derived(await getAssignments());
</script>

{#if assignments.length === 0}
  <Empty.Root>
    <Empty.Header>
      <Empty.Media variant="icon">
        <FileTextIcon />
      </Empty.Media>
      <Empty.Title>No assignments created</Empty.Title>
      <Empty.Description>
        Upload an assignment brief to get a step-by-step task list.
      </Empty.Description>
    </Empty.Header>
    <Empty.Content>
      <Button>Upload Assignment</Button>
    </Empty.Content>
  </Empty.Root>
{:else}
  <!--TODO: list assignments -->
{/if}
