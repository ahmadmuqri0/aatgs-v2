<script lang="ts">
  import { DateFormatter } from '@internationalized/date';
  import { FileTextIcon, CircleCheckIcon } from '@lucide/svelte';

  import CreateAssignmentDialog from '#lib/components/create-assignment-dialog.svelte';
  import { Badge } from '#lib/components/ui/badge/index.ts';
  import * as Card from '#lib/components/ui/card/index.ts';
  import * as Empty from '#lib/components/ui/empty/index.ts';
  import { Progress } from '#lib/components/ui/progress/index.ts';
  import { Spinner } from '#lib/components/ui/spinner/index.ts';
  import { getAssignments } from '#lib/remotes/assignment.remote.ts';

  const assignments = $derived(await getAssignments());

  const df = new DateFormatter('en-MY', {
    dateStyle: 'long'
  });
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
      <CreateAssignmentDialog />
    </Empty.Content>
  </Empty.Root>
{:else}
  <div class="flex flex-1 flex-col gap-4 rounded-2xl p-4 py-0">
    <div class="flex justify-end">
      <CreateAssignmentDialog />
    </div>
    <div class="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each assignments as assignment (assignment.id)}
        <Card.Root class="relative">
          <Card.Header>
            <Card.Title>
              <a href="/assignments/{assignment.id}" class="after:absolute after:inset-0">
                {assignment.title}
              </a>
            </Card.Title>
            <Card.Description>
              {#if assignment.dueDate}
                Due: {df.format(assignment.dueDate)}
              {:else}
                No due date
              {/if}
            </Card.Description>
          </Card.Header>
          <Card.Content class="flex flex-col gap-3">
            {#if assignment.latestStatus === 'pending'}
              <Badge variant="secondary">
                <Spinner data-icon="inline-start" />
                Generating...
              </Badge>
            {:else if assignment.latestStatus === 'failed'}
              <Badge variant="destructive">Generation failed</Badge>
            {/if}
            {#if assignment.progress && assignment.progress.total > 0}
              {@const { completed, total } = assignment.progress}
              {@const done = completed === total}
              {#if done}
                <Badge
                  class="bg-green-600/10 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                >
                  <CircleCheckIcon data-icon="inline-start" />
                  Completed
                </Badge>
              {/if}
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between text-sm text-muted-foreground">
                  <span>{completed} of {total} tasks</span>
                  <span>{Math.round((completed / total) * 100)}%</span>
                </div>
                <Progress
                  value={completed}
                  max={total}
                  aria-label="Task completion"
                  class={[
                    'h-2',
                    done &&
                      '*:data-[slot=progress-indicator]:bg-green-600 dark:*:data-[slot=progress-indicator]:bg-green-500'
                  ]}
                />
              </div>
            {/if}
            <p class="truncate text-muted-foreground">{assignment.fileName}</p>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  </div>
{/if}
