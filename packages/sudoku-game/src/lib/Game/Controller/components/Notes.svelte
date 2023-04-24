<script lang="ts">
  import type { Position } from '@octopuzzles/models';
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { Button, Input } from '@octopuzzles/ui';
  import { deepCopy } from '@octopuzzles/utils';

  const notes = gameHistory.getValue('notes');
  let input: Input;
  $: firstSelectedCell = $selectedCells.length === 1 ? $selectedCells[0] : undefined;

  $: if (firstSelectedCell) {
    populateFromSelectedCell(firstSelectedCell);
  }

  $: $selectedCells, input != null && setTimeout(() => input != null && input.focus(), 100);

  function populateFromSelectedCell(selectedCell: Position): void {
    value =
      $notes.find((n) =>
        n.positions.some((p) => p.row === selectedCell.row && p.column === selectedCell.column)
      )?.details ?? '';
  }

  let value = '';

  $: handleInput(value);

  function handleInput(newValue: string): void {
    if (firstSelectedCell == null) return;

    let newNotes = deepCopy($notes);
    let noteIndex = newNotes.findIndex((n) =>
      n.positions.some(
        (p) => p.row === firstSelectedCell?.row && p.column === firstSelectedCell?.column
      )
    );
    if (noteIndex !== -1) {
      if (newValue !== '') {
        newNotes.splice(noteIndex, 1, { ...newNotes[noteIndex], details: newValue });
      } else {
        newNotes.splice(noteIndex, 1);
      }
    } else if (newValue !== '') {
      newNotes.push({ positions: [firstSelectedCell], type: 'Note', details: newValue });
    }

    gameHistory.set({ notes: newNotes });
  }
</script>

<div class="w-full h-full flex flex-col justify-center items-center p-2">
  <Input
    bind:this={input}
    asTextarea
    bind:value
    placeholder="note"
    disabled={$selectedCells.length !== 1}
    title={$selectedCells.length !== 1
      ? 'Please select only one cell to make a note on'
      : 'Write a note'}
  />

  <Button on:click={() => (value = '')} class="mt-2 w-full">Clear note</Button>
</div>
