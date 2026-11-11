<script lang="ts">
  let { label = 'Count', start = 0 }: { label?: string; start?: number } = $props();

  // svelte-ignore state_referenced_locally -- `start` is only the initial value
  let count = $state(start);
</script>

<p>{label}: {count}</p>
<button onclick={() => count++}>Increment</button>
<button onclick={() => (count = start)} disabled={count === start}>Reset</button>
