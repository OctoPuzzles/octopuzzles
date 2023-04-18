<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { me } from '$stores/meStore';
  import { trpc } from '$lib/trpc/client';

  const token = $page.url.searchParams.get('token');

  let errors = false;

  onMount(async () => {
    if (token == null) {
      errors = true;
      return;
    }

    try {
      const res = await trpc($page).users.verify.mutate(token);
      me.set(res);
    } catch (e) {
      errors = true;
    }
  });
</script>

<svelte:head><title>Verify Account | OctoPuzzles</title></svelte:head>

<div class="p-4">
  {#if !errors}
    <h1 class="text-3xl font-bold">
      Your account has been verified, go to the <a class="text-blue underline" href="/">
        front page
      </a>
    </h1>
  {:else}
    <h1>
      Invalid token, please request a <a
        class="text-blue underline"
        href="/resend-verification-email">new verification email</a
      >
    </h1>
  {/if}
</div>
