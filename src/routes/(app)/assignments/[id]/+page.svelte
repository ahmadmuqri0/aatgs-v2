<script lang="ts">
  import { page } from '$app/state';
  import { DateFormatter } from '@internationalized/date';
  import { CalendarIcon, FileTextIcon } from '@lucide/svelte';
  import { SvelteSet } from 'svelte/reactivity';

  import * as Alert from '#lib/components/ui/alert/index.ts';
  import { Badge } from '#lib/components/ui/badge/index.ts';
  import { Checkbox } from '#lib/components/ui/checkbox/index.ts';
  import * as Empty from '#lib/components/ui/empty/index.ts';
  import { Progress } from '#lib/components/ui/progress/index.ts';
  import { Spinner } from '#lib/components/ui/spinner/index.ts';
  import { getAssignment, toggleTask } from '#lib/remotes/assignment.remote.ts';

  const assignment = $derived(await getAssignment(page.params.id!));
  const status = $derived(assignment.latestGeneration?.status ?? null);

  const total = $derived(assignment.tasks.length);
  const completed = $derived(assignment.tasks.filter((t) => t.completedAt).length);
  const percent = $derived(total ? Math.round((completed / total) * 100) : 0);
  const done = $derived(total > 0 && completed === total);

  const df = new DateFormatter('en-MY', { dateStyle: 'long' });

  // Checked state always comes from the server; the live query pushes the update back.
  const pending = new SvelteSet<string>();

  async function toggle(taskId: string, done: boolean) {
    pending.add(taskId);
    try {
      await toggleTask({ taskId, done });
    } catch (e) {
      console.error('Could not update task:', e);
    } finally {
      pending.delete(taskId);
    }
  }
</script>

<!--
  Fixed height so only the task list scrolls: 100svh minus the 4rem app header,
  the 1rem bottom padding, and (md+) the 1rem inset-sidebar margin.
-->
<div class="flex h-[calc(100svh-5rem)] flex-col gap-6 md:h-[calc(100svh-6rem)]">
  <header class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="text-2xl font-semibold tracking-tight">{assignment.title}</h1>
        {#if status === 'failed'}
          <Badge variant="destructive">Generation failed</Badge>
        {/if}
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span class="flex items-center gap-1.5">
          <CalendarIcon class="size-4" />
          {assignment.dueDate ? `Due ${df.format(assignment.dueDate)}` : 'No due date'}
        </span>
        <span class="flex min-w-0 items-center gap-1.5">
          <FileTextIcon class="size-4 shrink-0" />
          <span class="truncate">{assignment.fileName}</span>
        </span>
      </div>
    </div>

    {#if total > 0}
      <div class="flex flex-col gap-1.5">
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
        <div class="flex gap-4 text-sm text-muted-foreground">
          <span><span class="font-medium text-foreground">{percent}%</span> complete</span>
          <span><span class="font-medium text-foreground">{total - completed}</span> open</span>
          <span><span class="font-medium text-foreground">{completed}</span> done</span>
        </div>
      </div>
    {/if}
  </header>

  {#if status === 'failed'}
    <Alert.Root variant="destructive">
      <Alert.Title>Task generation failed</Alert.Title>
      <Alert.Description>
        {assignment.latestGeneration?.error ?? 'Something went wrong while generating tasks.'}
      </Alert.Description>
    </Alert.Root>
  {/if}

  {#if total > 0}
    <section class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
      <div class="border-b bg-muted/50 px-4 py-3 text-sm font-medium">
        {total} tasks
      </div>
      <ol class="min-h-0 flex-1 divide-y overflow-y-auto">
        {#each assignment.tasks as task (task.id)}
          <li class="flex gap-3 px-4 py-3 hover:bg-muted/30">
            <Checkbox
              id="task-{task.id}"
              class="mt-1"
              disabled={pending.has(task.id)}
              bind:checked={() => !!task.completedAt, (done) => toggle(task.id, done)}
            />
            <div class="flex min-w-0 flex-col gap-1">
              <label
                for="task-{task.id}"
                class={[
                  'cursor-pointer font-medium',
                  task.completedAt && 'text-muted-foreground line-through'
                ]}
              >
                {task.title}
              </label>
              {#if task.description}
                <p class="text-sm text-muted-foreground">{task.description}</p>
              {/if}
              <span class="text-xs text-muted-foreground">Step {task.position + 1}</span>
            </div>
          </li>
        {/each}
      </ol>
    </section>
  {:else if status === 'pending'}
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon"><Spinner /></Empty.Media>
        <Empty.Title>Generating tasks</Empty.Title>
        <Empty.Description>
          Gemini is reading your brief. This page updates on its own.
        </Empty.Description>
      </Empty.Header>
    </Empty.Root>
  {/if}
</div>
