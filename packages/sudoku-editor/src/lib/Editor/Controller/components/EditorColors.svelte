<script lang="ts">
  import { editorHistory, selectedCells } from '$lib/sudokuStore';
  import { get } from 'svelte/store';
  import { deepCopy } from '@octopuzzles/utils';
  import { Digits, type Color, type Digit } from '@octopuzzles/models';
  import { Colors } from '@octopuzzles/models';
  import Keypad from '../Keypad.svelte';

  const colors = editorHistory.getClue('colors');

  const inputColor = (newColor?: Color): void => {
    const positions = get(selectedCells);
    if (positions.length === 0) return;

    const currentColors = $colors;
    const newColors = deepCopy(currentColors);

    // Whether there has been any changes
    let anyChanges = false;

    // Check if we should clear all game cells
    const clearAllEditorCells =
      newColor == null && positions.every((p) => newColors[p.row]?.[p.column] == null);
    if (clearAllEditorCells) {
      // clear all the cells in the game
      editorHistory.clearCells(positions);
    } else {
      positions.forEach((position) => {
        // If we are deleting a cell
        if (newColor == null) {
          // If the cell is already empty
          if (newColors[position.row][position.column] == null) return;

          // Delete the value in the cell
          newColors[position.row][position.column] = null;
          anyChanges = true;
        } else {
          // We are putting some number in the cell

          // If the cell already contains the number, delete it
          if (newColors[position.row][position.column] === newColor) {
            newColors[position.row][position.column] = null;
            anyChanges = true;
          } else {
            // Insert the number
            newColors[position.row][position.column] = newColor;
            anyChanges = true;
          }
        }
      });
    }

    // If there has actually been any changes, update the game history
    if (anyChanges) {
      editorHistory.set({ colors: newColors });
    }
  };

  function handleClick(color?: Color): void {
    inputColor(color);
  }

  const getButtonInfo = (key: string) => {
    const digit = key as Digit;
    const color = Colors[Digits.indexOf(digit)].toLowerCase();
    return { class: 'text-' + color + '-500 bg-' + color + '-500', custom: true };
  };

  const handleDigit = (digit: Digit | '') => {
    const newColor = digit === '' ? undefined : Colors[Digits.indexOf(digit)];
    const positions = get(selectedCells);
    if (positions.length === 0) return;

    const currentColors = $colors;
    const newColors = deepCopy(currentColors);

    // Whether there has been any changes
    let anyChanges = false;

    // Check if we should clear all game cells
    const clearAllEditorCells =
      newColor == null && positions.every((p) => newColors[p.row]?.[p.column] == null);
    if (clearAllEditorCells) {
      // clear all the cells in the game
      editorHistory.clearCells(positions);
    } else {
      positions.forEach((position) => {
        // If we are deleting a cell
        if (newColor == null) {
          // If the cell is already empty
          if (newColors[position.row][position.column] == null) return;

          // Delete the value in the cell
          newColors[position.row][position.column] = null;
          anyChanges = true;
        } else {
          // We are putting some number in the cell

          // If the cell already contains the number, delete it
          if (newColors[position.row][position.column] === newColor) {
            newColors[position.row][position.column] = null;
            anyChanges = true;
          } else {
            // Insert the number
            newColors[position.row][position.column] = newColor;
            anyChanges = true;
          }
        }
      });
    }

    // If there has actually been any changes, update the game history
    if (anyChanges) {
      editorHistory.set({ colors: newColors });
    }
  };
</script>

<Keypad {getButtonInfo} {handleDigit} />
