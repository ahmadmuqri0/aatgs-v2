<script lang="ts">
  import { RefreshCwIcon } from '@lucide/svelte';

  import { Button } from '#lib/components/ui/button/index.ts';
  import * as Dialog from '#lib/components/ui/dialog/index.ts';
  import * as Field from '#lib/components/ui/field/index.ts';
  import * as Select from '#lib/components/ui/select/index.ts';
  import { Spinner } from '#lib/components/ui/spinner/index.ts';
  import { DEFAULT_MODEL_TIER, MODEL_TIERS, MODEL_TIER_INFO, type ModelTier } from '#lib/models.ts';
  import { retryGeneration } from '#lib/remotes/assignment.remote.ts';

  interface Props {
    assignmentId: string;
    /** Tier of the latest generation, preselected in the dropdown */
    lastTier: ModelTier | null;
    /** Number of tasks already checked off, to warn that progress resets */
    completed: number;
  }

  let { assignmentId, lastTier, completed }: Props = $props();

  let open = $state(false);
  let tier = $state<ModelTier>(DEFAULT_MODEL_TIER);
  let submitting = $state(false);

  function onOpenChange(isOpen: boolean) {
    if (isOpen) tier = lastTier ?? DEFAULT_MODEL_TIER;
  }

  async function regenerate() {
    submitting = true;
    try {
      await retryGeneration({ assignmentId, tier });
      open = false;
    } catch (e) {
      console.error('Could not regenerate tasks:', e);
    } finally {
      submitting = false;
    }
  }
</script>

<Dialog.Root bind:open {onOpenChange}>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm" class="shrink-0">
        <RefreshCwIcon data-icon="inline-start" />
        Regenerate
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Regenerate tasks?</Dialog.Title>
      <Dialog.Description>
        Gemini will read the brief again and make a new task list. The current list stays until the
        new one is ready.
        {#if completed > 0}
          <strong class="text-foreground">
            The new list starts unchecked, so your {completed} checked-off
            {completed === 1 ? 'task' : 'tasks'} won't carry over.
          </strong>
        {/if}
      </Dialog.Description>
    </Dialog.Header>

    <Field.Field>
      <Field.Label for="regenerate-model">Model</Field.Label>
      <Select.Root type="single" bind:value={tier}>
        <Select.Trigger id="regenerate-model" class="w-full">
          {MODEL_TIER_INFO[tier].label}
        </Select.Trigger>
        <Select.Content>
          {#each MODEL_TIERS as t (t)}
            <Select.Item value={t} label={MODEL_TIER_INFO[t].label}>
              <div class="flex flex-col">
                <span>
                  {MODEL_TIER_INFO[t].label}
                  {#if t === lastTier}
                    <span class="text-xs text-muted-foreground">(last used)</span>
                  {/if}
                </span>
                <span class="text-xs text-muted-foreground">{MODEL_TIER_INFO[t].description}</span>
              </div>
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </Field.Field>

    <Dialog.Footer>
      <Dialog.Close>
        {#snippet child({ props })}
          <Button {...props} variant="outline" disabled={submitting}>Cancel</Button>
        {/snippet}
      </Dialog.Close>
      <Button disabled={submitting} onclick={regenerate}>
        {#if submitting}<Spinner data-icon="inline-start" />{/if}
        Regenerate
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
