<script lang="ts">
  import { Modal } from '@octopuzzles/ui';
  import WalkthroughViewer from '$lib/WalkthroughViewer.svelte';
  import type { GameHistoryStep, WalkthroughStep } from '@octopuzzles/models';
  import type { EditorHistoryStep } from '@octopuzzles/models';

  export let isOpen: boolean;

  export let clues: EditorHistoryStep;
  export let walkthrough: WalkthroughStep[];
  export let onClickStep: (step: GameHistoryStep) => void;
</script>

<Modal bind:isOpen>
  <div class="min-w-[42rem]">
    <WalkthroughViewer {clues} {walkthrough} {onClickStep} />
  </div>
</Modal>
