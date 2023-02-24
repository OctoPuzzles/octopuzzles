<script lang="ts">
  import Button from '$ui/Button.svelte';
  import Logo from '$icons/Logo.svelte';
  import Input from '$ui/Input.svelte';
  import { authMode } from '$stores/authStore';
  import type { InferMutationInput } from '$lib/client/trpc';
  import trpc from '$lib/client/trpc';
  import type { TRPCError } from '@trpc/server';

  let username = '';
  let email = '';
  let password = '';

  let loading = false;

  let errors: TRPCError | undefined;

  /** If the signup was successful */
  let registerCompleted = false;

  async function register(data: InferMutationInput<'users:register'>) {
    return await trpc().mutation('users:register', data);
  }

  const handleRegister = async (): Promise<void> => {
    errors = undefined;
    try {
      loading = true;
      await register({ username, email, password });
      registerCompleted = true;
      username = '';
      email = '';
      password = '';
    } catch (e) {
      errors = e as TRPCError;
    } finally {
      loading = false;
    }
  };
</script>

<div class="px-4 sm:px-6">
  <Logo withText={false} size={200} />
  <h2 class="text-3xl font-bold text-gray-900 mt-4">Sign Up</h2>
</div>
<div class="mt-6 relative flex-1 px-4 sm:px-6">
  {#if registerCompleted}
    <div>
      <p>Thank you for signing up to OctoPuzzles.</p>
      <p>We have send you an email with a verification link.</p>
      <p>
        If you didn't get a verification email, you can request a new one <a
          class="text-blue-500 underline"
          href="/resend-verification-email">here</a
        >
      </p>
      <Button on:click={() => authMode.setAuthMode()}>Okay</Button>
    </div>
  {:else}
    <form on:submit|preventDefault={handleRegister}>
      {#if errors}
        <p class="text-sm text-red-500">{errors.message}</p>
      {/if}
      <Input data-ignoreshortcuts label="Username" bind:value={username} />
      <Input data-ignoreshortcuts label="Email" bind:value={email} />
      <Input data-ignoreshortcuts label="Password" type="password" bind:value={password}>
        <p slot="help">Your password should be at least 10 characters long</p>
      </Input>
      <Button variant="primary" class="mt-4 w-full" {loading}>Sign up</Button>
    </form>
    <p class="text-xs text-gray-500 mt-4">
      By signing up, you agree to our <a
        href="/terms-and-conditions"
        on:click={() => authMode.setAuthMode(undefined)}
        class="hover:underline text-blue-500">terms and conditions</a
      >
    </p>
    <hr class="mt-6 mb-2" />
    <div class="flex justify-around mb-1">
      <button class="text-xs" on:click={() => authMode.setAuthMode('login')}>
        Already have an account?
      </button>
    </div>
  {/if}
</div>
