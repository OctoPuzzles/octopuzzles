<script lang="ts">
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { deepCopy, undefinedIfEmpty } from '@octopuzzles/utils';
  import { get } from 'svelte/store';
  import Keypad from '../Keypad.svelte';
  import { Colors, Digits, type Digit } from '@octopuzzles/models';

  const getButtonInfo = (key: string) => {
    const digit = key as Digit;
    const color = Colors[Digits.indexOf(digit)].toLowerCase();
    return { class: 'text-' + color + '-500 bg-' + color + '-500', custom: true };
  };

  const handleDigit = (digit: Digit | '') => {
    const color = digit === '' ? undefined : Colors[Digits.indexOf(digit)];
    const positions = get(selectedCells);
    if (positions.length === 0) return;

    const currentCellValues = get(gameHistory.getValue('cellValues'));
    const newCellValues = deepCopy(currentCellValues);

    if (color === undefined) {
      const clearAllGameCells = positions.every((p) => !currentCellValues[p.row][p.column].colors);
      if (clearAllGameCells) {
        // completely clear the selected cells
        gameHistory.clearCells(positions);
        return;
      } else {
        // Remove the colors from all selected cells
        positions.forEach((p) => {
          delete newCellValues[p.row][p.column].colors;
        });
      }
    } else {
      let allCellsHasColor = positions.every((p) =>
        currentCellValues[p.row][p.column].colors?.includes(color)
      );

      if (!allCellsHasColor) {
        // Add it to the cells that does not have it
        positions.forEach((p) => {
          const colors = currentCellValues[p.row][p.column].colors;
          if (colors) {
            if (!colors.includes(color)) {
              newCellValues[p.row][p.column].colors = [...colors, color]
                .map((c) => Colors.indexOf(c))
                .sort()
                .map((n) => Colors[n]);
            }
          } else {
            newCellValues[p.row][p.column].colors = [color];
          }
        });
      } else {
        // Remove it from all cells
        positions.forEach((p) => {
          const colors = currentCellValues[p.row][p.column].colors;
          if (colors) {
            newCellValues[p.row][p.column].colors = undefinedIfEmpty(
              colors.filter((c) => c !== color)
            );
          }
        });
      }
    }

    gameHistory.set({ cellValues: newCellValues });
  };
</script>

<Keypad {getButtonInfo} {handleDigit} />
