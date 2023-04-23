<script lang="ts">
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { deepCopy, undefinedIfEmpty } from '@octopuzzles/utils';
  import { get } from 'svelte/store';
  import { scanner } from '$lib/sudokuStore/scanner';
  import Keypad from '../Keypad.svelte';
  import type { Digit } from '@octopuzzles/models';

  const { givens } = get(gameHistory.clues);

  const handleDigit = (digit: Digit | '') => {
    const positions = get(selectedCells).filter((p) => !(givens[p.row]?.[p.column] !== ''));
    if (positions.length === 0) return;

    const currentCellValues = get(gameHistory.getValue('cellValues'));
    const newCellValues = deepCopy(currentCellValues);

    // Check if we should clear all game cells
    const clearAllGameCells =
      digit === '' && positions.every((p) => !currentCellValues[p.row][p.column].digits);
    if (clearAllGameCells) {
      // clear all the cells in the game
      gameHistory.clearCells(positions);
    } else {
      // Whether there has been any changes
      let anyChanges = false;
      let runScan = false;

      // If we are deleting a cell
      if (digit === '') {
        for (const position of positions) {
          // If the cell is already empty
          if (!newCellValues[position.row][position.column].digits) continue;

          // Delete the value in the cell
          delete newCellValues[position.row][position.column].digits;
          anyChanges = true;
        }
      } else {
        // We are putting some number in the cell
        let allCellsHaveValue = positions.every((p) => {
          return currentCellValues[p.row][p.column].digits?.includes(digit);
        });

        if (!allCellsHaveValue) {
          // Add it to the cells that do not have it
          positions.forEach((p) => {
            const isSCell = currentCellValues[p.row][p.column].modifiers?.some(
              (m) => m === 'SCell'
            );
            const currentDigits = currentCellValues[p.row][p.column].digits;
            if (isSCell && currentDigits) {
              newCellValues[p.row][p.column].digits = [currentDigits[0] ?? '', digit].sort();
              delete newCellValues[p.row][p.column].centermarks;
              delete newCellValues[p.row][p.column].cornermarks;
            } else if (!currentCellValues[p.row][p.column].digits?.includes(digit)) {
              // Insert the number
              newCellValues[p.row][p.column].digits = [digit];
              if (isSCell) {
                newCellValues[p.row][p.column].centermarks = undefinedIfEmpty(
                  newCellValues[p.row][p.column].centermarks?.filter((s) => s !== digit)
                );
                newCellValues[p.row][p.column].cornermarks = undefinedIfEmpty(
                  newCellValues[p.row][p.column].cornermarks?.filter((s) => s !== digit)
                );
              } else {
                delete newCellValues[p.row][p.column].centermarks;
                delete newCellValues[p.row][p.column].cornermarks;
              }
            } else {
              return;
            }
            anyChanges = true;
            runScan = get(scanner.scannerSettings).autoScan ?? false;
          });
        } else {
          // Remove it from all cells
          positions.forEach((p) => {
            newCellValues[p.row][p.column].digits = undefinedIfEmpty(
              currentCellValues[p.row][p.column].digits?.filter((d) => d !== digit)
            );
            anyChanges = true;
          });
        }
      }

      // If there has actually been any changes, update the game history
      if (anyChanges) {
        gameHistory.set({
          cellValues: newCellValues
        });

        if (runScan) {
          scanner.startScan(positions[0]);
        }
      }
    }
  };
</script>

<Keypad {handleDigit}>
  <div slot="digit" let:digit>
    {digit}
  </div>
</Keypad>
