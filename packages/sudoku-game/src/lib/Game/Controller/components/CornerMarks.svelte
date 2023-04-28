<script lang="ts">
  import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { get } from 'svelte/store';
  import { deepCopy, isDeleteKey, undefinedIfEmpty } from '@octopuzzles/utils';
  import { SquareButton } from '@octopuzzles/ui';
  import classNames from 'classnames';
  import { gameAction } from '$lib/gameAction';
  import type { Digit } from '@octopuzzles/models';

  function handleClick(newCornermark: string): void {
    const currentCellValues = get(gameHistory.getValue('cellValues'));
    const newCellValues = deepCopy(currentCellValues);
    const { givens } = get(gameHistory.clues);
    let positions = deepCopy(get(selectedCells));

    positions = positions.filter((p) => givens[p.row][p.column] === '');
    if (positions.length === 0) return;

    if (newCornermark === '') {
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
      const digit = newCornermark as Digit;
      const allCellsHasCornerMark = positions.every((p) =>
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
  }

  function handleKeyDown(k: KeyboardEvent): void {
    if (isDeleteKey(k)) {
      k.preventDefault();
      handleClick('');
    } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(k.key)) {
      handleClick(k.key);
    } else if (k.code.startsWith('Digit')) {
      handleClick(k.code.replace('Digit', ''));
    }
  }
</script>

<svelte:window use:gameAction={{ onKeyDown: handleKeyDown }} />

<div class="w-full h-full flex justify-center items-center">
  <div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as i}
      <div>
        <SquareButton variant="secondary" class="p-1" on:click={() => handleClick(String(i))}>
          <div class="w-full h-full relative">
            <p
              class={classNames('absolute', {
                'left-0': (i - 1) % 3 === 0,
                'left-1/2 -translate-x-1/2': (i - 1) % 3 === 1,
                'right-0': (i - 1) % 3 === 2,
                'top-0': Math.floor((i - 1) / 3) === 0,
                'top-1/2 -translate-y-1/2': Math.floor((i - 1) / 3) === 1,
                'bottom-0': Math.floor((i - 1) / 3) === 2,
                'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2': i === 0
              })}
            >
              {i}
            </p>
          </div>
        </SquareButton>
      </div>
    {/each}
    <div class="col-span-2">
      <SquareButton class="w-36 p-3" on:click={() => handleClick('')}>
        <Backspace size={32} />
      </SquareButton>
    </div>
  </div>
</div>
