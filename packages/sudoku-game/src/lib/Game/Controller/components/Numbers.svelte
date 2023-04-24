<script lang="ts">
  import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { deepCopy, isDeleteKey, undefinedIfEmpty } from '@octopuzzles/utils';
  import { get } from 'svelte/store';
  import { SquareButton } from '@octopuzzles/ui';
  import { scanner } from '$lib/sudokuStore/scanner';
  import { gameAction } from '$lib/gameAction';
  import type { Digit } from '@octopuzzles/models';

  function handleClick(newValue: string): void {
    const positions = get(selectedCells);
    if (positions.length === 0) return;

    const currentCellValues = get(gameHistory.getValue('cellValues'));
    const newCellValues = deepCopy(currentCellValues);
    // Check if we should clear all game cells
    const clearAllGameCells =
      newValue === '' && positions.every((p) => !currentCellValues[p.row][p.column].digits);
    if (clearAllGameCells) {
      // clear all the cells in the game
      gameHistory.clearCells(positions);
    } else {
      // Whether there has been any changes
      let anyChanges = false;
      let runScan = false;
      // If we are deleting a cell
      if (newValue === '') {
        for (const position of positions) {
          // If the cell is already empty
          if (!newCellValues[position.row][position.column].digits) continue;
          // Delete the value in the cell
          delete newCellValues[position.row][position.column].digits;
          anyChanges = true;
        }
      } else {
        const digit = newValue as Digit;
        // We are putting some number in the cell
        let allCellsHaveValue = positions.every((p) => {
          return currentCellValues[p.row][p.column].digits?.includes(digit);
        });
        if (!allCellsHaveValue) {
          // Add it to the cells that do not have it
          positions.forEach((p) => {
            const currentDigits = currentCellValues[p.row][p.column].digits;
            if (!currentDigits?.includes(digit)) {
              // Insert the number
              newCellValues[p.row][p.column].digits = [digit];

              delete newCellValues[p.row][p.column].centermarks;
              delete newCellValues[p.row][p.column].cornermarks;
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
        gameHistory.set({ cellValues: newCellValues });
        if (runScan) {
          scanner.startScan(positions[0]);
        }
      }
    }
  }

  function handleKeyDown(k: KeyboardEvent): void {
    if (isDeleteKey(k)) {
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
        <SquareButton variant="secondary" class="text-3xl" on:click={() => handleClick(String(i))}
          >{String(i)}</SquareButton
        >
      </div>
    {/each}
    <div class="col-span-2">
      <SquareButton class="w-36 p-3" on:click={() => handleClick('')}>
        <Backspace size={32} />
      </SquareButton>
    </div>
  </div>
</div>
