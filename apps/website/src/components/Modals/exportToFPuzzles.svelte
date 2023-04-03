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
</script>

<Modal bind:isOpen>
  {#if isOpen}
    <!-- Only compute the puzzle data if the modal is open -->
    {@const puzzleData = compressToBase64(
      exportAsFPuzzlesJson(clues, userInputs, title, description)
    )}
    <div class="p-4">
      Export to FPuzzles
      <FPuzzlesLink class="w-6 h-6 block" {puzzleData} />
      Export to Cracking the Cryptic
      <CtCLink class="w-6 h-6 block" {puzzleData} />
    </div>
  {/if}
</Modal>
