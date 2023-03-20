<script context="module" lang="ts">
  const openModals = new Set();

  function count() {
    return [...openModals].length;
  }

  export function hasOpenModals() {
    return count() > 0;
  }
</script>

<script lang="ts">
  import Portal from 'svelte-portal';
  import { onDestroy } from 'svelte';

  export let isOpen: boolean;

  let dialog: HTMLDialogElement;

  $: if (dialog && isOpen) {
    openModals.add(dialog);
    dialog.showModal();
  } else {
    openModals.delete(dialog);
  }

  onDestroy(() => {
    openModals.delete(dialog);
  });
</script>

<Portal target="body">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <dialog
    class="max-w-2xl rounded p-0 border-0"
    bind:this={dialog}
    on:close={() => (isOpen = false)}
    on:click|self={() => dialog.close()}
  >
    <div
      on:click|stopPropagation={() => {
        /***/
      }}
    >
      <slot close={() => dialog.close()} />
    </div>
  </dialog>
</Portal>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
