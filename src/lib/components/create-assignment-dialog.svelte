<script lang="ts">
  import type { DateValue } from '@internationalized/date';

  import { FileTextIcon, PlusIcon, XIcon } from '@lucide/svelte';

  import DatePicker from '#lib/components/date-picker.svelte';
  import { Button } from '#lib/components/ui/button/index.ts';
  import * as Dialog from '#lib/components/ui/dialog/index.ts';
  import * as Field from '#lib/components/ui/field/index.ts';
  import * as FileDropZone from '#lib/components/ui/file-drop-zone/index.ts';
  import { Input } from '#lib/components/ui/input/index.ts';
  import { createAssignment } from '#lib/remotes/assignment.remote.ts';
  import { MAX_DOCS_SIZE } from '#lib/schemas/assignment.ts';

  let open = $state(false);
  let dueDateVal = $state<DateValue>();

  const { title, dueDate, brief } = createAssignment.fields;

  let dueDateInput = $state<HTMLInputElement | null>(null);

  function setDueDate(v: DateValue | undefined) {
    dueDateVal = v;
    if (!dueDateInput) return;

    dueDateInput.value = v?.toString() ?? '';
    dueDateInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  let briefInput = $state<HTMLInputElement | null>(null);
  let rejectReason = $state<string | null>(null);
  const file = $derived(brief.value() as File | undefined);

  function setFile(f: File | null) {
    rejectReason = null;
    if (!briefInput) return;

    const dt = new DataTransfer();
    if (f) dt.items.add(f);
    briefInput.files = dt.files;

    briefInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const onUpload: FileDropZone.FileDropZoneRootProps['onUpload'] = async (files) => {
    if (files.length === 0) return;
    setFile(files[0]);
  };

  const onFileRejected: FileDropZone.FileDropZoneRootProps['onFileRejected'] = ({ reason }) => {
    rejectReason = reason;
  };

  function resetForm() {
    setFile(null);
    setDueDate(undefined);
    createAssignment.element?.reset();
  }
</script>

<Dialog.Root
  bind:open
  onOpenChangeComplete={(isOpen) => {
    if (!isOpen) resetForm();
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
    <form
      enctype="multipart/form-data"
      {...createAssignment.enhance(async ({ submit }) => {
        if (await submit()) open = false;
      })}
    >
      <Field.Group>
        <Field.Field data-invalid={!!title.issues()}>
          <Field.Label for="title">Title</Field.Label>
          <Input
            id="title"
            placeholder="CSC253 Assignment"
            autocomplete="off"
            {...title.as('text')}
          />
          <Field.Error errors={title.issues()} />
        </Field.Field>

        <Field.Field data-invalid={!!dueDate.issues()}>
          <Field.Label for="dueDate">due Date</Field.Label>
          <DatePicker id="dueDate" bind:value={() => dueDateVal, setDueDate} />
          <Input
            bind:ref={dueDateInput}
            type="hidden"
            name={dueDate.as('text').name}
            value={dueDateVal?.toString() ?? ''}
          />
          <Field.Error errors={dueDate.issues()} />
        </Field.Field>

        <Field.Field data-invalid={!!(rejectReason || brief.issues())}>
          <Field.Label for="brief">Assignment brief</Field.Label>

          {#if file}
            <div class="flex items-center justify-between gap-2 rounded-md border p-2">
              <div class="flex min-w-0 items-center gap-2">
                <FileTextIcon class="size-5 shrink-0 text-muted-foreground" />
                <div class="flex min-w-0 flex-col">
                  <span class="truncate text-sm">{file.name}</span>
                  <span class="text-xs text-muted-foreground"
                    >{FileDropZone.displaySize(file.size)}</span
                  >
                </div>
              </div>
              <Button type="button" variant="outline" size="icon" onclick={() => setFile(null)}>
                <XIcon />
              </Button>
            </div>
          {:else}
            <FileDropZone.Root
              id="brief"
              {onUpload}
              {onFileRejected}
              accept="application/pdf"
              maxFiles={1}
              fileCount={0}
              maxFileSize={MAX_DOCS_SIZE}
            >
              <FileDropZone.Trigger />
            </FileDropZone.Root>
          {/if}

          <Input
            bind:ref={briefInput}
            type="file"
            class="hidden"
            name={brief.as('file').name}
            aria-invalid={brief.as('file')['aria-invalid']}
          />
          <Field.Error errors={rejectReason ? [{ message: rejectReason }] : brief.issues()} />
        </Field.Field>
        <Field.Field>
          <Button type="submit" class="w-full" disabled={createAssignment.pending > 0}>
            Create
          </Button>
        </Field.Field>
      </Field.Group>
    </form>
  </Dialog.Content>
</Dialog.Root>
