<script>
  import { untrack } from 'svelte';
  import * as Card from '#lib/components/ui/card/index.ts';
  import * as Form from '#lib/components/ui/form/index.ts';
  import * as Alert from '#lib/components/ui/alert/index.ts';
  import { Input } from '#lib/components/ui/input/index.ts';
  import { Button } from '#lib/components/ui/button/index.ts';
  import { Checkbox } from '#lib/components/ui/checkbox/index.ts';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters/zod4';
  import { registerSchema } from './schema.ts';
  import { CircleExclamationPointIcon, EyeIcon, EyeOffIcon } from '@lucide/svelte';

  let { data } = $props();

  let isHidden = $state(true);
  let isConfirmHidden = $state(true);

  const form = superForm(
    untrack(() => data.form),
    { validators: zodClient(registerSchema) }
  );

  const { form: formData, enhance, message, submitting } = form;
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <Card.Root class="mx-auto w-full max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Create an Account</Card.Title>
      <Card.Description>Enter your information belwow tto create your account</Card.Description>
    </Card.Header>

    <form method="POST" use:enhance>
      <Card.Content class="flex flex-col gap-4">
        <Form.Field {form} name="name">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Full Name</Form.Label>
              <Input
                {...props}
                type="text"
                placeholder="John Doe"
                autocomplete="off"
                bind:value={$formData.name}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

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

        <Form.Field {form} name="confirm">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Confirm Password</Form.Label>
              <div class="relative">
                <Input
                  {...props}
                  type={isConfirmHidden ? 'password' : 'text'}
                  bind:value={$formData.confirm}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={() => (isConfirmHidden = !isConfirmHidden)}
                  class="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  {#if isConfirmHidden}
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
          <Alert.Root
            class="max-w-md border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50"
          >
            <CircleExclamationPointIcon />
            <Alert.Title>Something went wrong</Alert.Title>
            <Alert.Description>{$message}</Alert.Description>
          </Alert.Root>
        {/if}

        <Form.Button class="w-full" disabled={$submitting}>Register</Form.Button>
      </Card.Content>
    </form>
  </Card.Root>
</div>
