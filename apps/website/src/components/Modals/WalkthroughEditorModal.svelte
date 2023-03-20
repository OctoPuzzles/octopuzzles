<script lang="ts">
  import WalkthroughEditor from '$features/walkthroughs/WalkthroughEditor.svelte';
  import type { EditorHistoryStep } from '@octopuzzles/models';
  import { Modal } from '@octopuzzles/ui';

  export let isOpen: boolean;

  export let clues: EditorHistoryStep;
</script>

<Modal bind:isOpen>
  <WalkthroughEditor {clues} />
</Modal>
