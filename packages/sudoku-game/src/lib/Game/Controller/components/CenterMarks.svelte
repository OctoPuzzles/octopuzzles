<script lang="ts">
  import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { get } from 'svelte/store';
  import { deepCopy, isDeleteKey, undefinedIfEmpty } from '@octopuzzles/utils';
  import { SquareButton } from '@octopuzzles/ui';
  import { gameAction } from '$lib/gameAction';
  import type { Digit } from '@octopuzzles/models';

  const handleClick = (newCentermark: string): void => {
    const currentCellValues = get(gameHistory.getValue('cellValues'));
    const newCellValues = deepCopy(currentCellValues);
    const { givens } = get(gameHistory.clues);
    let positions = deepCopy(get(selectedCells));

    positions = positions.filter((p) => givens[p.row][p.column] === '');
    if (positions.length === 0) return;

    if (newCentermark === '') {
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
      const digit = newCentermark as Digit;
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

  function handleKeyDown(k: KeyboardEvent): void {
    if (isDeleteKey(k)) {
      k.preventDefault();
      handleClick('');
    } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(k.key)) {
      handleClick(k.key);
    }
  }
</script>

<svelte:window use:gameAction={{ onKeyDown: handleKeyDown }} />

<div class="w-full h-full flex justify-center items-center">
  <div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as i}
      <div>
        <SquareButton
          variant="secondary"
          text={String(i)}
          on:click={() => handleClick(String(i))}
        />
      </div>
    {/each}
    <div class="col-span-2">
      <SquareButton class="w-36 p-3" on:click={() => handleClick('')}>
        <Backspace size={32} />
      </SquareButton>
    </div>
  </div>
</div>
