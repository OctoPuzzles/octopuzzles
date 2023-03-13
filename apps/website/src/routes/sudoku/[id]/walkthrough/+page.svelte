<script lang="ts">
  import type { PageData } from './$types';
  import WalkthroughViewer from '$features/walkthroughs/WalkthroughViewer.svelte';
  import { fillSudokuWithDefaults } from '$utils/fillSudokuWithDefaults';

  export let data: PageData;
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
  <WalkthroughViewer
    clues={fillSudokuWithDefaults(data.sudoku)}
    walkthrough={data.walkthrough?.steps ?? []}
  />
</div>
