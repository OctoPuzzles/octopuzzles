<script lang="ts">
  import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { deepCopy, isDeleteKey, undefinedIfEmpty } from '@octopuzzles/utils';
  import { get } from 'svelte/store';
  import type { Color } from '@octopuzzles/models';
  import { Colors } from '@octopuzzles/models';
  import { SquareButton } from '@octopuzzles/ui';
  import { gameAction } from '$lib/gameAction';

  function handleKeyDown(k: KeyboardEvent): void {
    if (isDeleteKey(k)) {
      k.preventDefault();
      handleClick();
    } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(k.key)) {
      handleClick(Colors[Number(k.key)]);
    }
  }

  const inputColor = (newColor?: Color): void => {
    const positions = get(selectedCells);
    if (positions.length === 0) return;

    const currentCellValues = get(gameHistory.getValue('cellValues'));
    const newCellValues = deepCopy(currentCellValues);
    if (newColor === undefined) {
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
      const allCellsHasColor = positions.every((p) =>
        currentCellValues[p.row][p.column].colors?.includes(newColor)
      );
      if (!allCellsHasColor) {
        // Add it to the cells that does not have it
        positions.forEach((p) => {
          const colors = currentCellValues[p.row][p.column].colors;
          if (colors) {
            if (!colors.includes(newColor)) {
              newCellValues[p.row][p.column].colors = [...colors, newColor]
                .map((c) => Colors.indexOf(c))
                .sort()
                .map((n) => Colors[n]);
            }
          } else {
            newCellValues[p.row][p.column].colors = [newColor];
          }
        });
      } else {
        // Remove it from all cells
        positions.forEach((p) => {
          const colors = currentCellValues[p.row][p.column].colors;
          if (colors) {
            newCellValues[p.row][p.column].colors = undefinedIfEmpty(
              colors.filter((c) => c !== newColor)
            );
          }
        });
      }
    }
    gameHistory.set({ cellValues: newCellValues });
  };

  function handleClick(color?: Color): void {
    inputColor(color);
  }
</script>

<svelte:window use:gameAction={{ onKeyDown: handleKeyDown }} />

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
      <SquareButton on:click={() => handleClick()} title="Backspace" class="w-36 p-3">
        <Backspace size={32} />
      </SquareButton>
    </div>
  </div>
</div>
