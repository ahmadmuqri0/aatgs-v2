<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { CalendarDate, type DateValue } from '@internationalized/date';
  import { PencilIcon, XIcon } from '@lucide/svelte';

  import DatePicker from '#lib/components/date-picker.svelte';
  import { Button } from '#lib/components/ui/button/index.ts';
  import * as Dialog from '#lib/components/ui/dialog/index.ts';
  import * as Field from '#lib/components/ui/field/index.ts';
  import { Input } from '#lib/components/ui/input/index.ts';
  import { updateAssignment } from '#lib/remotes/assignment.remote.ts';

  interface Props {
    assignment: { id: string; title: string; dueDate: Date | null };
  }

  let { assignment }: Props = $props();

  let open = $state(false);
  let dueDateVal = $state<DateValue>();

  const { title, dueDate } = updateAssignment.fields;

  function toCalendarDate(d: Date) {
    return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  // Prefill with the current values every time the dialog opens.
  function onOpenChange(isOpen: boolean) {
    if (!isOpen) return;
    dueDateVal = assignment.dueDate ? toCalendarDate(assignment.dueDate) : undefined;
    updateAssignment.fields.set({
      id: assignment.id,
      title: assignment.title,
      dueDate: dueDateVal?.toString() ?? ''
    });
  }

  function setDueDate(v: DateValue | undefined) {
    dueDateVal = v;
    dueDate.set(v?.toString() ?? '');
  }
</script>

<Dialog.Root bind:open {onOpenChange}>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm" class="shrink-0">
        <PencilIcon data-icon="inline-start" />
        Edit
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit assignment</Dialog.Title>
      <Dialog.Description>Change the title or due date.</Dialog.Description>
    </Dialog.Header>
    <form
      {...updateAssignment.enhance(async ({ submit }) => {
        if (await submit()) {
          open = false;
          // Breadcrumb and tab title come from the page load, not the live query.
          await invalidateAll();
        }
      })}
    >
      <input {...updateAssignment.fields.id.as('hidden', assignment.id)} />
      <Field.Group>
        <Field.Field data-invalid={!!title.issues()}>
          <Field.Label for="edit-title">Title</Field.Label>
          <Input id="edit-title" autocomplete="off" {...title.as('text')} />
          <Field.Error errors={title.issues()} />
        </Field.Field>

        <Field.Field data-invalid={!!dueDate.issues()}>
          <Field.Label for="edit-dueDate">Due date</Field.Label>
          <div class="flex items-center gap-2">
            <DatePicker
              id="edit-dueDate"
              class="flex-1"
              bind:value={() => dueDateVal, setDueDate}
            />
            {#if dueDateVal}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear due date"
                onclick={() => setDueDate(undefined)}
              >
                <XIcon />
              </Button>
            {/if}
          </div>
          <input {...dueDate.as('hidden', dueDateVal?.toString() ?? '')} />
          <Field.Error errors={dueDate.issues()} />
        </Field.Field>

        <Field.Field>
          <Button type="submit" class="w-full" disabled={updateAssignment.pending > 0}>Save</Button>
        </Field.Field>
      </Field.Group>
    </form>
  </Dialog.Content>
</Dialog.Root>
