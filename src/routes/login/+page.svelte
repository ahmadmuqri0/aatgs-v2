<script lang="ts">
  import * as Card from '#lib/components/ui/card/index.ts';
  import * as Alert from '#lib/components/ui/alert/index.ts';
  import * as Field from '#lib/components/ui/field/index.ts';
  import { Input } from '#lib/components/ui/input/index.ts';
  import { Button } from '#lib/components/ui/button/index.ts';
  import { Checkbox } from '#lib/components/ui/checkbox/index.ts';
  import { login } from '#lib/remotes/auth.remote.ts';
  import { loginSchema } from '#lib/schemas/auth.ts';
  import { CircleExclamationPointIcon, EyeIcon, EyeOffIcon } from '@lucide/svelte';

  let isHidden = $state(true);

  const { email, password, rememberMe } = login.fields;
  const errors = $derived(login.fields.issues());
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <Card.Root class="mx-auto w-full max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Login to your account</Card.Title>
      <Card.Description>Enter your email below to login to your account</Card.Description>
    </Card.Header>

    <form {...login.preflight(loginSchema)}>
      <Card.Content class="flex flex-col gap-4">
        <Field.Field data-invalid={!!email.issues()}>
          <Field.Label for="email">Email</Field.Label>
          <Input
            id="email"
            placeholder="johndoe@gmail.com"
            autocomplete="off"
            {...email.as('email')}
          />
          <Field.Error errors={email.issues()} />
        </Field.Field>

        <Field.Field data-invalid={!!password.issues()}>
          <Field.Label for="password">Password</Field.Label>
          <div class="relative">
            <Input id="password" {...password.as(isHidden ? 'password' : 'text')} />
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
          <Field.Error errors={password.issues()} />
        </Field.Field>

        <Field.Field orientation="horizontal">
          <Checkbox
            id="rememberMe"
            name={rememberMe.as('checkbox').name}
            bind:checked={() => rememberMe.value() ?? true, (v) => rememberMe.set(v)}
          />
          <Field.Label for="rememberMe">Remember me</Field.Label>
        </Field.Field>

        {#if errors?.length}
          <Alert.Root
            class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50"
          >
            <CircleExclamationPointIcon />
            <Alert.Title>{errors[0].message}</Alert.Title>
          </Alert.Root>
        {/if}
        <Field.Field>
          <Button type="submit" class="w-full" disabled={login.pending > 0}>Login</Button>
          <Field.Description class="text-center">
            Don&apos;t have an account? <a href="/register">Register</a>
          </Field.Description>
        </Field.Field>
      </Card.Content>
    </form>
  </Card.Root>
</div>
