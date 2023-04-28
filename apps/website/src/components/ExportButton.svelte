<script lang="ts">
  import FileArrowUp from 'phosphor-svelte/lib/FileArrowUp/FileArrowUp.svelte';
  import { navigating } from '$app/stores';
  import { CtC, FPuzzles } from '@octopuzzles/icons';
  import { exportPuzzle } from '$features/fpuzzles/exportAsFPuzzlesJson';
  import type { EditorHistoryStep, GameHistoryStep } from '@octopuzzles/models';

  export let clues: EditorHistoryStep;
  export let gameData: GameHistoryStep;
  export let sudokuTitle: string;
  export let description: string;

  let exportDetails: HTMLDetailsElement;

  $: if ($navigating && exportDetails != null) exportDetails.open = false;
</script>

<details bind:this={exportDetails}>
  <summary
    class="cursor-pointer flex justify-center items-center mr-2 w-8 h-8 hover:ring hover:ring-orange-500 rounded"
    aria-label="Export to f-puzzles/CtC"
    aria-haspopup="menu"
    title="Export to f-puzzles/CtC"
  >
    <FileArrowUp size={32} />
  </summary>
  <div
    class="absolute list-none shadow-lg bg-white ring-1 ring-black ring-opacity-10 focus:outline-none rounded-md mt-0.5 overflow-hidden z-50"
    role="menu"
  >
    <button
      on:click={() => exportPuzzle(clues, gameData, sudokuTitle, description, 'FPuzzles')}
      class="w-8 h-8"
      title="Export to f-puzzles"
    >
      <FPuzzles />
    </button>
    <button
      on:click={() => exportPuzzle(clues, gameData, sudokuTitle, description, 'CTC')}
      class="w-8 h-8"
      title="Export to CtC"
    >
      <CtC />
    </button>
  </div>
</details>

<style>
  /* Allow the export dropdown to close when pressing outside the dropdown */
  details[open] > summary::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 40;
    display: block;
    cursor: default;
    content: ' ';
    background: transparent;
  }
</style>
