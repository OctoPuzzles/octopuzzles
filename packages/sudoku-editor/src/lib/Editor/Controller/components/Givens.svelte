<script lang="ts">
  import { editorHistory, selectedCells } from '$lib/sudokuStore';
  import { get } from 'svelte/store';
  import type { Digit } from '@octopuzzles/models';
  import Keypad from '../Keypad.svelte';
  import { deepCopy } from '@octopuzzles/utils';

  const givens = editorHistory.getClue('givens');

  const handleDigit = (digit: Digit | '') => {
    const positions = get(selectedCells);
    if (positions.length === 0) return;

    const currentGivens = $givens;
    const newGivens = deepCopy(currentGivens);

    // Whether there has been any changes
    let anyChanges = false;

    // Check if we should clear all game cells
    const clearAllEditorCells =
      digit === '' && positions.every((p) => newGivens[p.row]?.[p.column] === '');
    if (clearAllEditorCells) {
      // clear all the cells in the game
      editorHistory.clearCells(positions);
    } else {
      for (const position of positions) {
        // If we are deleting a cell
        if (digit === '') {
          // If the cell is already empty
          if (newGivens[position.row][position.column] === '') continue;

          // Delete the value in the cell
          newGivens[position.row][position.column] = '';
          anyChanges = true;
        } else {
          // We are putting some number in the cell

          // If the cell already contains the number, delete it
          newGivens[position.row][position.column] = digit as Digit;
          anyChanges = true;
        }
      }
    }

    // If there has actually been any changes, update the game history
    if (anyChanges) {
      editorHistory.set({ givens: newGivens });
    }
  };
</script>

<Keypad {handleDigit}>
  <div slot="digit" let:digit>
    {digit}
  </div>
</Keypad>
