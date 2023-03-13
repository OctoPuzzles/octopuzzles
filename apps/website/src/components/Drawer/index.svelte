<script lang="ts">
  import X from 'phosphor-svelte/lib/X/X.svelte';
  import { fade, fly } from 'svelte/transition';

  // PROPS //
  /** Whether or not the drawer is open */
  export let open = true;
  /** Function to be called when drawer is closed */
  export let onClose: () => void;
  /** class for the drawer, not the backdrop or closing icon */
  let className = '';
  export { className as class };

  const ANIMATION_DURATION = 300;

  const handleClose = (): void => {
    onClose();
    open = false;
  };
</script>

<svelte:window
  on:keydown={(k) => {
    if (k.key === 'Escape') {
      handleClose();
    }
  }}
/>

{#if open}
  <div
    class="fixed inset-0 overflow-hidden z-50"
    aria-labelledby="slide-over-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        on:click={handleClose}
        transition:fade={{ duration: ANIMATION_DURATION }}
        class="absolute inset-0 bg-gray-500 bg-opacity-75 transition"
        aria-hidden="true"
      />

      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          transition:fly={{ duration: ANIMATION_DURATION, x: 300 }}
          class="relative w-screen max-w-md"
        >
          <div class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
            <button
              on:click={handleClose}
              class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span class="sr-only">Close panel</span>
              <X size={24} />
            </button>
          </div>

          <div
            class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll {className ?? ''}"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
