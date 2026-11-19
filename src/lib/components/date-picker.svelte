<script lang="ts">
  import { ChevronDownIcon } from '@lucide/svelte';
  import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
  import * as Popover from '#lib/components/ui/popover/index.ts';
  import { Button } from '#lib/components/ui/button/index.ts';
  import { Calendar } from '#lib/components/ui/calendar/index.ts';

  interface Props {
    id: string;
    value?: DateValue;
  }

  let { id, value = $bindable() }: Props = $props();
  let open = $state(false);

  const df = new DateFormatter('en-MY', {
    dateStyle: 'long'
  });
</script>

<Popover.Root bind:open>
  <Popover.Trigger {id}>
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="w-32 justify-between font-normal">
        {value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
        <ChevronDownIcon data-icon="inline-end" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0" align="start">
    <Calendar
      type="single"
      bind:value
      minValue={today(getLocalTimeZone())}
      onValueChange={() => (open = false)}
    />
  </Popover.Content>
</Popover.Root>
