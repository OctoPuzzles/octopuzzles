<script lang="ts">
  import { SudokuDisplay } from '@octopuzzles/sudoku-display';
  import Controller from './Controller/index.svelte';
  import {
    selectedCells,
    highlightedCells,
    wrongCells,
    inputMode,
    gameHistory,
    handleMouseDownHitbox,
    handleMouseEnterHitbox
  } from '$lib/sudokuStore';
  import type {
    EditorHistoryStep,
    GameHistoryStep,
    ScannerSettings,
    Solution,
    WalkthroughStep
  } from '@octopuzzles/models';
  import { defaultClues, getUserSolution } from '@octopuzzles/sudoku-utils';
  import { scanner } from '$lib/sudokuStore/scanner';
  import { onDestroy, onMount, setContext } from 'svelte';
  import { gameAction, handleWindowClick } from '$lib/gameAction';
  import {
    handleArrows,
    handleClickCell,
    handleEnterCell
  } from '$lib/sudokuStore/interactionHandlers';

  // SIZING
  let windowHeight: number;
  let windowWidth: number;
  /**
   * The sudoku should be contained within the screen
   * However the screen might get so small, that we make it at least 300px big
   */
  $: sudokuSize = Math.max(Math.min(windowHeight - 88, windowWidth), 300);

  export let clues: EditorHistoryStep;

  export let gameData: GameHistoryStep;

  export let walkthrough: WalkthroughStep[];

  export let solution: Solution | undefined = undefined;

  export let scannerSettings: ScannerSettings | undefined;

  export let onScannerSettingsChange: (newSettings: ScannerSettings) => void;
  setContext('updateScannerSettings', onScannerSettingsChange);

  export let onDone: (() => void) | undefined = undefined;

  onMount(() => {
    gameHistory.clues.set(clues);
  });

  onDestroy(() => {
    gameHistory.clues.set(defaultClues());
  });

  const storeGameData = gameHistory.subscribeToInputs();

  $: gameData = $storeGameData;

  $: gameHistory.clues.set(clues);

  $: scanner.configure(scannerSettings);

  $: if (solution != null && onDone != null) {
    if (
      checkSolution(
        gameData.cellValues.map((row) => row.map((cell) => cell.digits?.join('') ?? ''))
      )
    ) {
      onDone();
    }
  }

  function checkSolution(numbers: string[][]): boolean {
    $wrongCells = [];
    if (solution?.numbers == null) return false;

    if (
      solution.numbers.length !== numbers.length ||
      solution.numbers[0].length !== numbers[0].length
    ) {
      return false;
    }

    const userSolution = getUserSolution({
      givens: clues.givens,
      values: numbers
    });

    let isDone = true;

    userSolution.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (solution && solution.numbers[rowIndex][columnIndex] !== cell) {
          if (cell.length > 0) {
            $wrongCells = [...$wrongCells, { row: rowIndex, column: columnIndex }];
          }
          isDone = false;
        }
      });
    });
    return isDone;
  }
</script>

<svelte:window
  bind:innerHeight={windowHeight}
  bind:innerWidth={windowWidth}
  on:click={handleWindowClick}
  use:gameAction={{ onArrowKeyDown: handleArrows }}
/>

<div class="flex flex-wrap w-full justify-around" id="sudoku-game">
  <div class="p-2 mb-2" style="height: {sudokuSize}px; width: {sudokuSize}px" id="sudoku-display">
    <SudokuDisplay
      {clues}
      {gameData}
      highlightedCells={$highlightedCells}
      selectedCells={$selectedCells}
      wrongCells={$wrongCells}
      onClickNote={(_, position) => {
        $inputMode = 'notes';
        $selectedCells = [position];
      }}
      onClickCell={handleClickCell}
      onEnterCell={handleEnterCell}
      onMouseDownHitbox={$handleMouseDownHitbox}
      onMouseEnterHitbox={$handleMouseEnterHitbox}
    />
  </div>
  <div class="my-auto">
    <Controller bind:walkthrough>
      <slot />
    </Controller>
  </div>
</div>
