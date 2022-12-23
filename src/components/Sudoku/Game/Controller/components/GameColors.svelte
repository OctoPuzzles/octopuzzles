<script lang="ts">
  import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
  import { gameHistory, selectedCells } from '$stores/sudokuStore';
  import deepCopy from '$utils/deepCopy';
  import SquareButton from '$ui/SquareButton.svelte';
  import { get } from 'svelte/store';
  import { numberColorMap } from '$constants';
  import { isDeleteKey } from '$utils/isDeleteKey';
  import type { Color } from '$models/Sudoku';
  import { hasOpenModals } from '$stores/modalStore';

  function handleKeyDown(k: KeyboardEvent): void {
    //do not accept keyboard input when any modal controls are open
    if (hasOpenModals()) return;

    if (isDeleteKey(k)) {
      k.preventDefault();
      handleClick();
    } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(k.key)) {
      handleClick(numberColorMap[Number(k.key)]);
    }
  }

  const inputColor = (newColor?: Color): void => {
    const positions = get(selectedCells);
    if (positions.length === 0) return;

    const currentColors = get(gameHistory.getValue('colors'));
    const newColors = deepCopy(currentColors);

    // Check if we should clear all game cells
    const clearAllGameCells =
      newColor == null && positions.every((p) => currentColors[p.row]?.[p.column] == null);
    if (clearAllGameCells) {
      // clear all the cells in the game
      gameHistory.clearCells(positions);
    } else {
      // Whether there has been any changes
      let anyChanges = false;

      positions.forEach((position) => {
        // If we are deleting a cell
        if (newColor == null) {
          // If the cell is already empty
          if (newColors[position.row][position.column] == null) return;

          // Delete the value in the cell
          newColors[position.row][position.column] = [];
          anyChanges = true;
        } else {
          // We are putting some number in the cell

          // If the cell already contains the number, delete it
          if (newColors[position.row][position.column].includes(newColor)) {
            newColors[position.row][position.column] = newColors[position.row][
              position.column
            ].filter((c) => c !== newColor);
            anyChanges = true;
          } else {
            // Insert the number
            newColors[position.row][position.column] = [
              ...newColors[position.row][position.column],
              newColor
            ];
            anyChanges = true;
          }
        }
      });

      // If there has actually been any changes, update the game history
      if (anyChanges) {
        gameHistory.set({ colors: newColors });
      }
    }
  };

  function handleClick(color?: Color): void {
    inputColor(color);
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="w-full h-full flex justify-center items-center">
  <div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as number}
      {@const color = numberColorMap[number]}
      <div>
        <SquareButton
          variant="customColor"
          class="text-{color.toLowerCase()}-500 bg-{color.toLowerCase()}-500"
          on:click={() => handleClick(color)}
          title={number}
        />
      </div>
    {/each}

    <div class="col-span-2">
      <SquareButton on:click={() => handleClick()} title="Backspace" class="w-36 p-3">
        <Backspace size={32} />
      </SquareButton>
    </div>
  </div>
</div>
