<script lang="ts">
  import { default as Modal } from '$lib/ui/Modal.svelte';
  import { default as Button } from '$lib/ui/Button.svelte';

  export let isOpen: boolean;
  export let notificationMessage: string;
</script>

<Modal bind:isOpen let:close>
  <div class="p-4">
    <p class="text-center mb-4">{notificationMessage}</p>
    <div class="flex gap-2">
      <Button class="w-full" variant="default" on:click={() => close()}>OK</Button>
    </div>
  </div>
</Modal>
