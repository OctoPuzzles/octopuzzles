<script lang="ts">
  import { Button, Modal } from '@octopuzzles/ui';

  export let isOpen: boolean;
  export let onAccept: () => Promise<void>;
</script>

<Modal bind:isOpen let:close>
  <div class="p-4">
    <p class="text-2xl text-center mb-4">Are you sure?</p>
    <p class="text-center mb-4">This action can not be reversed</p>
    <div class="flex gap-2">
      <Button class="w-1/2" variant="default" on:click={() => close()}>Cancel</Button>
      <Button
        class="w-1/2"
        variant="danger"
        on:click={() => {
          onAccept();
          close();
        }}>Yes</Button
      >
    </div>
  </div>
</Modal>
