<script lang="ts">
  import { cellSize } from '$constants';
  import SudokuDisplay from '$components/Sudoku/Display/index.svelte';
  import Controller from './Controller/index.svelte';
  import Interface from '$components/Sudoku/Display/Clues/Interface.svelte';
  import { highlightedCells, selectedCells, wrongCells } from '$stores/sudokuStore';
  import type { EditorHistoryStep, GameHistoryStep } from '$types';

  // SIZING
  let windowHeight: number;
  let windowWidth: number;
  /**
   * The sudoku should be contained within the screen
   * However the screen might get so small, that we make it at least 300px big
   */
  $: sudokuSize = Math.max(Math.min(windowHeight - 88, windowWidth), 300);

  export let givens: EditorHistoryStep['givens'];
  export let borderClues: EditorHistoryStep['borderclues'];
  export let cellClues: EditorHistoryStep['cellclues'];
  export let regions: EditorHistoryStep['regions'];
  export let cells: EditorHistoryStep['cells'];
  export let editorColors: EditorHistoryStep['editorcolors'];
  export let cages: EditorHistoryStep['cages'];
  export let paths: EditorHistoryStep['paths'];
  export let dimensions: EditorHistoryStep['dimensions'];
  export let logic: EditorHistoryStep['logic'];

  export let values: GameHistoryStep['values'];
  export let gameColors: GameHistoryStep['colors'];
  export let cornermarks: GameHistoryStep['cornermarks'];
  export let centermarks: GameHistoryStep['centermarks'];
  export let notes: GameHistoryStep['notes'];
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div class="flex flex-wrap w-full justify-around">
  <div class="p-2 mb-2" style="height: {sudokuSize}px; width: {sudokuSize}px" id="sudoku-display">
    <SudokuDisplay
      {borderClues}
      {cages}
      {cellClues}
      {cells}
      {dimensions}
      {editorColors}
      {givens}
      {logic}
      {notes}
      {paths}
      {regions}
      {cornermarks}
      {centermarks}
      {values}
      {gameColors}
    >
      <g slot="highlights">
        {#each $wrongCells as cell}
          <rect
            class="fill-current w-cell h-cell text-red-200"
            x={cellSize * cell.column}
            y={cellSize * cell.row}
            vector-effect="non-scaling-size"
          />
        {/each}
        {#if $selectedCells}
          {#each $selectedCells as cell}
            <rect
              class="fill-current w-cell h-cell text-orange-300 text-opacity-40"
              x={cellSize * cell.column}
              y={cellSize * cell.row}
              vector-effect="non-scaling-size"
            />
          {/each}
        {/if}
        {#if $highlightedCells}
          {#each $highlightedCells as cell}
            <rect
              class="fill-current w-cell h-cell text-blue-100"
              x={cellSize * cell.column}
              y={cellSize * cell.row}
              vector-effect="non-scaling-size"
            />
          {/each}
        {/if}
      </g>

      <Interface {cells} {dimensions} slot="interface" />
    </SudokuDisplay>
  </div>
  <div class="my-auto">
    <Controller />
  </div>
</div>
