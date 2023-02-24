<script lang="ts">
  import { closeModal } from '$stores/modalStore';
  import Button from '$ui/Button.svelte';

  export let isOpen: boolean;
  export let onAccept: () => Promise<void>;
</script>

{#if isOpen}
  <div role="dialog" class="bg-white shadow rounded-md p-4 flex flex-col">
    <p class="text-2xl text-center mb-4">Are you sure?</p>
    <p class="text-center mb-4">This action can not be reversed</p>
    <div class="flex gap-2">
      <Button class="w-1/2" variant="default" on:click={closeModal}>Cancel</Button>
      <Button
        class="w-1/2"
        variant="danger"
        on:click={() => {
          onAccept();
          closeModal();
        }}>Yes</Button
      >
    </div>
  </div>
{/if}
