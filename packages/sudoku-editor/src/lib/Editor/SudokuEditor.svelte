<script lang="ts">
  import { SudokuDisplay } from '@octopuzzles/sudoku-display';
  import Controller from './Controller/index.svelte';
  import {
    editorHistory,
    handleArrows,
    handleMouseDown,
    handleMouseEnter,
    highlightedCells,
    selectedCells
  } from '$lib/sudokuStore';
  import type { EditorHistoryStep } from '@octopuzzles/models';
  import { onDestroy, onMount } from 'svelte';

  // SIZING
  let windowHeight: number;
  let windowWidth: number;
  /**
   * The sudoku should be contained within the screen
   * However the screen might get so small, that we make it at least 300px big
   */
  $: sudokuSize = Math.max(Math.min(windowHeight - 88, windowWidth), 300);

  export let clues: EditorHistoryStep;
  export let initialClues: EditorHistoryStep;

  onMount(() => {
    editorHistory.reset(initialClues);
    storeClues.subscribe((c) => (clues = c));
  });

  $: editorHistory.reset(initialClues);

  let storeClues = editorHistory.subscribeToClues();

  onDestroy(() => {
    editorHistory.reset();
  });

  let element: HTMLDivElement;
  let intersecting = true;

  $: if (element) {
    let observer = new IntersectionObserver(
      (entries) => {
        intersecting = entries[0].isIntersecting ?? false;
      },
      { root: document }
    );

    observer.observe(element);
  }
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div class="flex flex-wrap w-full justify-around">
  <div
    bind:this={element}
    class="p-2 mb-2"
    style="height: {sudokuSize}px; width: {sudokuSize}px"
    id="sudoku-display"
  >
    <SudokuDisplay
      {clues}
      highlightedCells={$highlightedCells}
      selectedCells={$selectedCells}
      handleArrows={$handleArrows}
      handleMouseDown={$handleMouseDown}
      handleMouseEnter={$handleMouseEnter}
      isEditor
    />
  </div>
  <div class="my-auto">
    {#if intersecting}
      <Controller>
        <slot />
      </Controller>
    {/if}
  </div>
</div>
