<script lang="ts">
  import { Button, Input } from '@octopuzzles/ui';
  import { Logo } from '@octopuzzles/icons';
  import { authMode } from '$stores/authStore';
  import { trpc } from '$lib/trpc/client';
  import { me } from '$stores/meStore';
  import type { TRPCError } from '@trpc/server';
  import { page } from '$app/stores';

  let usernameOrEmail = '';
  let password = '';
  let loading = false;

  let errors: TRPCError | undefined;

  async function handleLogin(): Promise<void> {
    errors = undefined;
    try {
      loading = true;
      const res = await trpc($page).users.login.mutate({ usernameOrEmail, password });
      me.set(res);
      authMode.setAuthMode();
      usernameOrEmail = '';
      password = '';
    } catch (e) {
      errors = e as TRPCError;
    } finally {
      loading = false;
    }
  }
</script>

<div class="px-4 sm:px-6">
  <Logo withText={false} size={200} />
  <h2 class="text-3xl font-bold text-gray-900 mt-4">Log In</h2>
</div>
<div class="mt-6 relative flex-1 px-4 sm:px-6">
  <form on:submit|preventDefault={handleLogin}>
    {#if errors}
      <p class="text-sm text-red-500">{errors.message}</p>
    {/if}
    <Input label="Username or Email" placeholder="username or email" bind:value={usernameOrEmail} />
    <Input label="Password" placeholder="password" type="password" bind:value={password} />
    <Button variant="primary" class="mt-4 w-full" {loading}>Log In</Button>
  </form>

  <hr class="mt-6 mb-2" />
  <div class="flex justify-around mb-4">
    <a href="/forgot-password" class="text-xs" on:click={() => authMode.setAuthMode()}>
      Forgot Password?
    </a>
    <button class="text-xs" on:click={() => authMode.setAuthMode('signup')}>
      Create Account
    </button>
  </div>
</div>
