<script lang="ts">
  import { CtCLink, FPuzzlesLink } from '@octopuzzles/ui';
  import { exportAsFPuzzlesJson } from '$features/fpuzzles/exportAsFPuzzlesJson';
  import { compressToBase64 } from '@octopuzzles/utils';

  export let isOpen: boolean;

  let puzzleData = compressToBase64(exportAsFPuzzlesJson());
</script>

{#if isOpen}
  <div role="dialog" class="bg-white shadow rounded-md p-4 flex flex-col">
    <FPuzzlesLink class="w-6 h-6 block" {puzzleData} />
    <CtCLink class="w-6 h-6 block" {puzzleData} />
  </div>
{/if}
