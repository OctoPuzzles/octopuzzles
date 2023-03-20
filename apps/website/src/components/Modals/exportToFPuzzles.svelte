<script lang="ts">
  import { CtCLink, FPuzzlesLink, Modal } from '@octopuzzles/ui';
  import { exportAsFPuzzlesJson } from '$features/fpuzzles/exportAsFPuzzlesJson';
  import { compressToBase64 } from '@octopuzzles/utils';

  export let isOpen: boolean;

  let puzzleData = compressToBase64(exportAsFPuzzlesJson());
</script>

<Modal bind:isOpen>
  <div class="p-4">
    Export to FPuzzles
    <FPuzzlesLink class="w-6 h-6 block" {puzzleData} />
    Export to Cracking the Cryptic
    <CtCLink class="w-6 h-6 block" {puzzleData} />
  </div>
</Modal>
