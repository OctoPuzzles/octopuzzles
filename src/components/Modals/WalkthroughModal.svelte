<script lang="ts">
  import WalkthroughEditor from '$features/walkthroughs/WalkthroughEditor.svelte';
  import WalkthroughViewer from '$features/walkthroughs/WalkthroughViewer.svelte';
  import type { EditorHistoryStep } from '$types';

  export let editable = false;
  export let isOpen: boolean;

  export let clues: EditorHistoryStep;
</script>

{#if isOpen}
  <div
    role="dialog"
    class="bg-white shadow max-h-[90vh] rounded-md flex flex-col overflow-y-hidden"
  >
    {#if editable}
      <WalkthroughEditor {clues} />
    {:else}
      <WalkthroughViewer {clues} />
    {/if}
  </div>
{/if}
