<script lang="ts">
  import { editorHistory, gameHistory } from '$stores/sudokuStore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { walkthroughStore } from '$stores/walkthroughStore';
  import { fillWalkthroughStore } from '$utils/fillWalkthroughStore';
  import WalkthroughViewer from '$features/walkthroughs/WalkthroughViewer.svelte';
  import { fillSudokuWithDefaults } from '$utils/fillSudokuWithDefaults';

  export let data: PageData;

  const sudokuTitle = editorHistory.title;
  const description = editorHistory.description;

  $: if (data.walkthrough?.steps) {
    // Just so ts will shut up
    fillWalkthroughStore(data.walkthrough);
  } else {
    walkthroughStore.set([]);
  }

  onMount(async () => {
    let sud = data.sudoku;
    if (!sud) {
      await goto('/');
      return;
    }

    $sudokuTitle = sud.title;
    $description = sud.description;

    editorHistory.reset({
      borderclues: sud.borderclues ?? undefined,
      cellclues: sud.cellclues ?? undefined,
      regions: sud.regions ?? undefined,
      givens: sud.givens ?? undefined,
      cells: sud.cells ?? undefined,
      colors: sud.colors ?? undefined,
      extendedcages: sud.extendedcages ?? undefined,
      paths: sud.paths ?? undefined,
      dimensions: sud.dimensions,
      logic: sud.logic ?? undefined
    });
    gameHistory.reset();
  });
</script>

<svelte:head>
  <title>{data.sudoku.title} walkthrough | OctoPuzzles</title>
  <meta name="description" content={data.sudoku?.description} />

  <meta property="og:title" content="{data.sudoku?.title ?? 'Sudoku'} | OctoPuzzles" />
  <meta property="og:description" content={data.sudoku?.description} />
  <meta property="og:url" content="http://www.octopuzzles.com/sudoku/{data.sudoku.id}" />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="mx-auto max-w-[100vh] min-w-[50vw]">
  <WalkthroughViewer clues={fillSudokuWithDefaults(data.sudoku)} />
</div>
