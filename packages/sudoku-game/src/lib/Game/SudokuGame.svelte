<script lang="ts">
  import { SudokuDisplay } from '@octopuzzles/sudoku-display';
  import Controller from './Controller/index.svelte';
  import {
    selectedCells,
    highlightedCells,
    wrongCells,
    inputMode,
    handleArrows,
    handleMouseDown,
    handleMouseEnter
  } from '$lib/sudokuStore';
  import type {
    EditorHistoryStep,
    GameHistoryStep,
    ScannerSettings,
    WalkthroughStep
  } from '@octopuzzles/models';

  // SIZING
  let windowHeight: number;
  let windowWidth: number;
  /**
   * The sudoku should be contained within the screen
   * However the screen might get so small, that we make it at least 300px big
   */
  $: sudokuSize = Math.max(Math.min(windowHeight - 88, windowWidth), 300);

  export let clues: EditorHistoryStep;

  export let userInputs: GameHistoryStep;

  export let walkthrough: WalkthroughStep[];

  export let scannerSettings: ScannerSettings;

  export let onScannerSettingsChange: (newSettings: ScannerSettings) => void;
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div class="flex flex-wrap w-full justify-around">
  <div class="p-2 mb-2" style="height: {sudokuSize}px; width: {sudokuSize}px" id="sudoku-display">
    <SudokuDisplay
      {clues}
      {userInputs}
      highlightedCells={$highlightedCells}
      selectedCells={$selectedCells}
      wrongCells={$wrongCells}
      onClickNote={(note, position) => {
        $inputMode = 'notes';
        $selectedCells = [position];
      }}
      handleArrows={$handleArrows}
      handleMouseDown={$handleMouseDown}
      handleMouseEnter={$handleMouseEnter}
    />
  </div>
  <div class="my-auto">
    <Controller bind:walkthrough />
  </div>
</div>
