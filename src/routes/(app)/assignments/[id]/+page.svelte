<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { DateFormatter } from '@internationalized/date';
  import { CalendarIcon, ChevronDownIcon, FileTextIcon, Trash2Icon } from '@lucide/svelte';
  import { SvelteSet } from 'svelte/reactivity';

  import EditAssignmentDialog from '#lib/components/edit-assignment-dialog.svelte';
  import * as Alert from '#lib/components/ui/alert/index.ts';
  import { Badge } from '#lib/components/ui/badge/index.ts';
  import { Button } from '#lib/components/ui/button/index.ts';
  import { Checkbox } from '#lib/components/ui/checkbox/index.ts';
  import * as Dialog from '#lib/components/ui/dialog/index.ts';
  import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.ts';
  import * as Empty from '#lib/components/ui/empty/index.ts';
  import { Progress } from '#lib/components/ui/progress/index.ts';
  import { Spinner } from '#lib/components/ui/spinner/index.ts';
  import { MODEL_TIERS, MODEL_TIER_INFO, type ModelTier } from '#lib/models.ts';
  import {
    deleteAssignment,
    getAssignment,
    retryGeneration,
    toggleTask
  } from '#lib/remotes/assignment.remote.ts';

  const assignment = $derived(await getAssignment(page.params.id!));
  const status = $derived(assignment.latestGeneration?.status ?? null);

  const total = $derived(assignment.tasks.length);
  const completed = $derived(assignment.tasks.filter((t) => t.completedAt).length);
  const percent = $derived(total ? Math.round((completed / total) * 100) : 0);
  const done = $derived(total > 0 && completed === total);

  const df = new DateFormatter('en-MY', { dateStyle: 'long' });

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

  let retrying = $state(false);

  async function retry(tier: ModelTier) {
    retrying = true;
    try {
      await retryGeneration({ assignmentId: assignment.id, tier });
    } catch (e) {
      console.error('Could not retry generation:', e);
    } finally {
      retrying = false;
    }
  }

  let deleteOpen = $state(false);
  let deleting = $state(false);

  async function remove() {
    deleting = true;
    try {
      await deleteAssignment(assignment.id);
      await goto(resolve('/(app)/assignments'), { replaceState: true });
    } catch (e) {
      console.error('Could not delete assignment:', e);
      deleting = false;
    }
  }
</script>

<div class="flex h-[calc(100svh-5rem)] flex-col gap-6 md:h-[calc(100svh-6rem)]">
  <header class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="flex items-start justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-2xl font-semibold tracking-tight">{assignment.title}</h1>
          {#if status === 'failed'}
            <Badge variant="destructive">Generation failed</Badge>
          {/if}
        </div>

        <div class="flex shrink-0 gap-2">
          <EditAssignmentDialog {assignment} />
          <Dialog.Root bind:open={deleteOpen}>
            <Dialog.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="destructive" size="sm" class="shrink-0">
                  <Trash2Icon data-icon="inline-start" />
                  Delete
                </Button>
              {/snippet}
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete this assignment?</Dialog.Title>
                <Dialog.Description>
                  "{assignment.title}", its task list and the uploaded brief will be permanently
                  deleted. This can't be undone.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer>
                <Dialog.Close>
                  {#snippet child({ props })}
                    <Button {...props} variant="outline" disabled={deleting}>Cancel</Button>
                  {/snippet}
                </Dialog.Close>
                <Button variant="destructive" disabled={deleting} onclick={remove}>
                  {#if deleting}<Spinner data-icon="inline-start" />{/if}
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span class="flex items-center gap-1.5">
          <CalendarIcon class="size-4" />
          {assignment.dueDate ? `Due ${df.format(assignment.dueDate)}` : 'No due date'}
        </span>
        <a
          href={resolve('/(app)/assignments/[id]/brief', { id: assignment.id })}
          target="_blank"
          rel="noopener"
          title="Open the original brief"
          class="flex min-w-0 items-center gap-1.5 underline-offset-4 hover:text-foreground hover:underline"
        >
          <FileTextIcon class="size-4 shrink-0" />
          <span class="truncate">{assignment.fileName}</span>
        </a>
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
      <Alert.Action>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger disabled={retrying}>
            {#snippet child({ props })}
              <Button {...props} size="sm" variant="outline">
                {#if retrying}<Spinner data-icon="inline-start" />{/if}
                Retry with
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            {#each MODEL_TIERS as tier (tier)}
              <DropdownMenu.Item onSelect={() => retry(tier)}>
                <div class="flex flex-col">
                  <span>
                    {MODEL_TIER_INFO[tier].label}
                    {#if tier === assignment.latestGeneration?.tier}
                      <span class="text-xs text-muted-foreground">(last used)</span>
                    {/if}
                  </span>
                  <span class="text-xs text-muted-foreground">
                    {MODEL_TIER_INFO[tier].description}
                  </span>
                </div>
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Alert.Action>
    </Alert.Root>
  {/if}

  {#if total > 0}
    <section class="flex min-h-0 flex-col overflow-hidden rounded-lg border">
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
