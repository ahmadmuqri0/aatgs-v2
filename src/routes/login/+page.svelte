<script lang="ts">
  import { untrack } from 'svelte';
  import * as Card from '#lib/components/ui/card/index.ts';
  import * as Form from '#lib/components/ui/form/index.ts';
  import { Input } from '#lib/components/ui/input/index.ts';
  import { Checkbox } from '#lib/components/ui/checkbox/index.ts';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters/zod4';
  import { loginSchema } from './schema.ts';
  import { EyeIcon, EyeOffIcon } from '@lucide/svelte';
  import Button from '#lib/components/ui/button/button.svelte';

  let { data } = $props();

  let isHidden = $state(true);

  const form = superForm(
    untrack(() => data.form),
    { validators: zodClient(loginSchema) }
  );
  const { form: formData, enhance, message, submitting } = form;
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <Card.Root class="mx-auto w-full max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Login to your account</Card.Title>
      <Card.Description>Enter your email below to login to your account</Card.Description>
    </Card.Header>

    <form method="POST" use:enhance>
      <Card.Content class="flex flex-col gap-4">
        <Form.Field {form} name="email">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Email</Form.Label>
              <Input
                {...props}
                type="email"
                placeholder="johndoe@gmail.com"
                autocomplete="off"
                bind:value={$formData.email}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="password">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Password</Form.Label>
              <div class="relative">
                <Input
                  {...props}
                  type={isHidden ? 'password' : 'text'}
                  bind:value={$formData.password}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={() => (isHidden = !isHidden)}
                  class="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  {#if isHidden}
                    <EyeIcon class="h-4 w-4" />
                  {:else}
                    <EyeOffIcon class="h-4 w-4" />
                  {/if}
                </Button>
              </div>
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="rememberMe" class="flex items-center gap-2 space-y-0">
          <Form.Control>
            {#snippet children({ props })}
              <Checkbox {...props} bind:checked={$formData.rememberMe} />
              <Form.Label>Remember me</Form.Label>
            {/snippet}
          </Form.Control>
        </Form.Field>

        {#if $message}
          <p class="text-sm text-destructive">{$message}</p>
        {/if}

        <Form.Button class="w-full" disabled={$submitting}>Login</Form.Button>
      </Card.Content>
    </form>
  </Card.Root>
</div>
