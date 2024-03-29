<script lang="ts">
  import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
  import { editorHistory, selectedCells } from '$lib/sudokuStore';
  import { SquareButton } from '@octopuzzles/ui';
  import { get } from 'svelte/store';
  import { isDeleteKey, deepCopy } from '@octopuzzles/utils';
  import type { Color } from '@octopuzzles/models';
  import { Colors } from '@octopuzzles/models';
  import { editorAction } from '$lib/editorAction';

  const colors = editorHistory.getClue('colors');

  function handleKeyDown(k: KeyboardEvent): void {
    if (isDeleteKey(k)) {
      k.preventDefault();
      handleClick(undefined);
    } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(k.key)) {
      handleClick(Colors[Number(k.key)]);
    }
  }

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
</script>

<svelte:window use:editorAction={{ onKeyDown: handleKeyDown }} />

<div class="w-full h-full flex justify-center items-center">
  <div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as number}
      {@const color = Colors[number]}
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
      <SquareButton on:click={() => handleClick(undefined)} title="Backspace" class="w-36 p-3">
        <Backspace size={32} />
      </SquareButton>
    </div>
  </div>
</div>
