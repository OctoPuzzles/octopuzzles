<script lang="ts">
  import { Modal, Button, Input } from '@octopuzzles/ui';
  import { decompressFromBase64 } from '@octopuzzles/utils';
  import type { FPuzzlesJson } from '$features/fpuzzles/types';
  import { importFPuzzleIntoEditorHistory } from '$features/fpuzzles/importFPuzzleIntoEditor';
  import type { EditorHistoryStep, GameHistoryStep } from '@octopuzzles/models';

  export let isOpen: boolean;
  export let onImport: (params: {
    newEditorHistory: EditorHistoryStep;
    newGameHistory: GameHistoryStep;
    newTitle: string;
    newDescription: string;
  }) => void;

  let url = '';
  let error = '';

  function importPuzzle(): void {
    const beginnings = ['https://www.f-puzzles.com/?load=', 'https://f-puzzles.com/?load='];
    if (beginnings.every((b) => !url.startsWith(b))) {
      error = `Please specify a url starting with one of ${beginnings.join(', ')}`;
      return;
    }

    const importantPart = url.replace(/^.*f-puzzles\.com\/\?load=/, '');

    const jsonString = decompressFromBase64(importantPart) as FPuzzlesJson;

    if (jsonString == null) {
      error = 'Something went wrong when getting the data from f-puzzles. Please try again.';
      return;
    }

    const newState = importFPuzzleIntoEditorHistory(jsonString);
    onImport(newState);
  }
</script>

<Modal bind:isOpen let:close>
  <div class="w-96 p-4">
    <h2>Import puzzle from f-puzzles.com</h2>
    {#if error.length > 0}
      <p class="text-red-500">{error}</p>
    {/if}

    <Input class="mt-4" placeholder="https://www.f-puzzles.com/?load=abcdef..." bind:value={url} />

    <div class="w-full mt-8 gap-2 flex flex-col">
      <Button variant="default" on:click={close}>Cancel</Button>
      <Button
        variant="primary"
        on:click={() => {
          importPuzzle();
          close();
        }}>Import</Button
      >
    </div>
  </div>
</Modal>
