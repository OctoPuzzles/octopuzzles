<script lang="ts">
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { get } from 'svelte/store';
  import { deepCopy, undefinedIfEmpty } from '@octopuzzles/utils';
  import Keypad from '../Keypad.svelte';
  import type { Digit } from '@octopuzzles/models';

  const { givens } = get(gameHistory.clues);
  const getButtonInfo = () => {
    return { class: '' };
  };

  const handleDigit = (digit: Digit | '') => {
    const currentCellValues = get(gameHistory.getValue('cellValues'));
    const newCellValues = deepCopy(currentCellValues);
    let positions = deepCopy(get(selectedCells));

    positions = positions.filter((p) => givens[p.row][p.column] === '');
    if (positions.length === 0) return;

    if (digit === '') {
      const clearAllGameCells = positions.every(
        (p) => !currentCellValues[p.row][p.column].centermarks
      );
      if (clearAllGameCells) {
        // completely clear the selected cells
        gameHistory.clearCells(positions);
        return;
      } else {
        // Remove the center marks from all selected cells
        positions.forEach((p) => {
          delete newCellValues[p.row][p.column].centermarks;
        });
      }
    } else {
      const allCellsHasCenterMark = positions.every((p) =>
        currentCellValues[p.row][p.column].centermarks?.includes(digit)
      );

      if (!allCellsHasCenterMark) {
        // Add it to the cells that does not have it
        positions.forEach((p) => {
          const centermarks = currentCellValues[p.row][p.column].centermarks;
          if (centermarks) {
            if (!centermarks.includes(digit)) {
              newCellValues[p.row][p.column].centermarks = [...centermarks, digit].sort();
            }
          } else {
            newCellValues[p.row][p.column].centermarks = [digit];
          }
        });
      } else {
        // Remove it from all cells
        positions.forEach((p) => {
          const centermarks = currentCellValues[p.row][p.column].centermarks;
          if (centermarks) {
            newCellValues[p.row][p.column].centermarks = undefinedIfEmpty(
              centermarks.filter((s) => s !== digit)
            );
          }
        });
      }
    }

    gameHistory.set({ cellValues: newCellValues });
  };
</script>

<Keypad {getButtonInfo} {handleDigit}>
  <div slot="digit" let:digit>
    {digit}
  </div>
</Keypad>
