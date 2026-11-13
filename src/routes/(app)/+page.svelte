<script>
  import { Button } from '#lib/components/ui/button/index.ts';
  import { logout } from '#lib/remotes/auth.remote.ts';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<form {...logout}>
  <Button type="submit" class="cursor-pointer">Log Out</Button>
</form>
