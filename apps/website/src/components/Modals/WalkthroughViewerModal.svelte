<script lang="ts">
  import { Modal } from '@octopuzzles/ui';
  import WalkthroughViewer from '$features/walkthroughs/WalkthroughViewer.svelte';
  import type { WalkthroughStep } from '@octopuzzles/models';
  import type { EditorHistoryStep } from '@octopuzzles/models';

  export let isOpen: boolean;

  export let clues: EditorHistoryStep;
  export let walkthrough: WalkthroughStep[];
</script>

<Modal bind:isOpen>
  <WalkthroughViewer {clues} {walkthrough} />
</Modal>
