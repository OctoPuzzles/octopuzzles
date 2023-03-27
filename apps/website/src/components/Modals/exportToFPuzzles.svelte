<script lang="ts">
  import { CtCLink, FPuzzlesLink, Modal } from '@octopuzzles/ui';
  import { exportAsFPuzzlesJson } from '$features/fpuzzles/exportAsFPuzzlesJson';
  import { compressToBase64 } from '@octopuzzles/utils';
  import type { EditorHistoryStep, GameHistoryStep } from '@octopuzzles/models';

  export let isOpen: boolean;
  export let clues: EditorHistoryStep;
  export let userInputs: GameHistoryStep;
  export let title: string;
  export let description: string;

  let puzzleData = compressToBase64(exportAsFPuzzlesJson(clues, userInputs, title, description));
</script>

<Modal bind:isOpen>
  <div class="p-4">
    Export to FPuzzles
    <FPuzzlesLink class="w-6 h-6 block" {puzzleData} />
    Export to Cracking the Cryptic
    <CtCLink class="w-6 h-6 block" {puzzleData} />
  </div>
</Modal>
