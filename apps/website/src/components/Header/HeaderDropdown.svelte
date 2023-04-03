<script lang="ts">
  import { navigating } from '$app/stores';
  import { goto } from '$app/navigation';
  import UserCircle from 'phosphor-svelte/lib/UserCircle/UserCircle.svelte';
  import { authMode } from '$stores/authStore';
  import { Button } from '@octopuzzles/ui';
  import AuthDrawer from '$components/Drawer/AuthDrawer/index.svelte';
  import { trpc } from '$lib/trpc/client';
  import { me } from '$stores/meStore';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  async function getMe() {
    const res = await trpc($page).users.me.query();
    const settings = await trpc($page).users.getSettings.query();
    me.set(res, settings);
  }

  onMount(() => {
    getMe();
  });

  const handleLogout = async (): Promise<void> => {
    await trpc($page).users.logout.mutate();
    await getMe();
    await goto('/');
  };

  let details: HTMLDetailsElement;

  $: if ($navigating && details) details.open = false;
</script>

{#if $me}
  <details bind:this={details}>
    <summary
      class="cursor-pointer flex justify-center items-center mr-2"
      aria-label="View profile and more"
      aria-haspopup="menu"
    >
      <UserCircle size={35} />
    </summary>
    <div
      class="absolute right-2 left-auto list-none shadow-lg bg-white ring-1 ring-black ring-opacity-10 focus:outline-none w-56 rounded-md mt-0.5 overflow-hidden z-50"
      role="menu"
    >
      <p class="p-2">
        Hello <strong>{$me.username}</strong>
      </p>

      <hr />

      <ul class="py-1">
        <li class="w-full">
          <a
            data-sveltekit-preload-data
            href="/sudoku/editor"
            class="block py-1 px-2 hover:bg-gray-200 w-full">Create sudoku</a
          >
        </li>
        <li class="w-full">
          <a
            data-sveltekit-preload-data
            href="/user/{$me.id}"
            class="block py-1 px-2 hover:bg-gray-200 w-full">Profile</a
          >
        </li>
        <li class="w-full">
          <a
            data-sveltekit-preload-data
            href="/settings"
            class="block py-1 px-2 hover:bg-gray-200 w-full">Settings</a
          >
        </li>
      </ul>

      <hr />

      <div class="py-1">
        <button class="px-2 py-1 w-full text-left hover:bg-gray-200" on:click={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  </details>
{:else}
  <div class="flex space-x-2 pr-4">
    <Button on:click={() => authMode.setAuthMode('login')}>Log In</Button>
    <Button on:click={() => authMode.setAuthMode('signup')} variant="primary">Sign Up</Button>
  </div>
{/if}
<AuthDrawer />

<style>
  /* Allow the dropdown to close when pressing outside the dropdown */
  details[open] > summary::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 40;
    display: block;
    cursor: default;
    content: ' ';
    background: transparent;
  }
</style>
