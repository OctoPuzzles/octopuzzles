<script lang="ts">
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { get } from 'svelte/store';
  import { deepCopy, undefinedIfEmpty } from '@octopuzzles/utils';
  import type { Digit } from '@octopuzzles/models';
  import Keypad from '../Keypad.svelte';

  const { givens } = get(gameHistory.clues);

  const getButtonInfo = () => {
    return { class: 'p-1' };
  };

  const handleDigit = (digit: Digit | '') => {
    let currentCellValues = get(gameHistory.getValue('cellValues'));
    let newCellValues = deepCopy(currentCellValues);
    let positions = deepCopy(get(selectedCells));

    positions = positions.filter((p) => givens[p.row][p.column] === '');
    if (positions.length === 0) return;

    if (digit === '') {
      const clearAllGameCells = positions.every(
        (p) => !currentCellValues[p.row][p.column].cornermarks
      );
      if (clearAllGameCells) {
        // completely clear the selected cells
        gameHistory.clearCells(positions);
        return;
      } else {
        // Remove the center marks from all selected cells
        positions.forEach((p) => {
          delete newCellValues[p.row][p.column].cornermarks;
        });
      }
    } else {
      let allCellsHasCornerMark = positions.every((p) =>
        currentCellValues[p.row][p.column].cornermarks?.includes(digit)
      );

      if (!allCellsHasCornerMark) {
        // Add it to the cells that does not have it
        positions.forEach((p) => {
          const cornermarks = currentCellValues[p.row][p.column].cornermarks;
          if (cornermarks) {
            if (!cornermarks.includes(digit)) {
              newCellValues[p.row][p.column].cornermarks = [...cornermarks, digit].sort();
            }
          } else {
            newCellValues[p.row][p.column].cornermarks = [digit];
          }
        });
      } else {
        // Remove it from all cells
        positions.forEach((p) => {
          const cornermarks = currentCellValues[p.row][p.column].cornermarks;
          if (cornermarks) {
            newCellValues[p.row][p.column].cornermarks = undefinedIfEmpty(
              cornermarks.filter((s) => s !== digit)
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
    <div class="w-full h-full relative">
      <p class="absolute right-0 bottom-0">
        {digit}
      </p>
    </div>
  </div>
</Keypad>
