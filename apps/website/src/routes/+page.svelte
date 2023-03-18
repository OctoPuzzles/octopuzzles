<script lang="ts">
  import SudokuList from '$components/Sudoku/SudokuList.svelte';
  import { PuzzleLabel, Button } from '@octopuzzles/ui';
  import { Filters } from '@octopuzzles/icons';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import trpc from '$lib/client/trpc';

  export let data: PageData;
  let sudokus = data.sudokuData;

  let currentCursor: Date | null = null;
  let nextCursor: Date | null = null;
  $: nextCursor = sudokus.nextCursor;

  let loading = false;

  async function loadNextPage() {
    loading = true;
    currentCursor = nextCursor;
    let sudokuData = await trpc().query('sudokus:search', {
      labels: [],
      limit: 24,
      cursor: nextCursor ?? undefined
    });
    sudokus = sudokuData;
    nextCursor = sudokuData.nextCursor;
    loading = false;
  }

  async function refetch(labels: number[]) {
    loading = true;
    const sudokuData = await trpc().query('sudokus:search', {
      labels,
      limit: 24,
      cursor: currentCursor ?? undefined
    });
    sudokus = sudokuData;
    nextCursor = sudokuData.nextCursor;
    loading = false;
  }

  let showFilters = false;

  let activeLabels = $page.url.searchParams.getAll('label').map((l) => parseInt(l));

  function search(): void {
    $page.url.searchParams.delete('label');
    activeLabels.forEach((l) => {
      $page.url.searchParams.append('label', l.toString());
    });

    window.history.pushState('page2', 'Title', '?' + $page.url.searchParams.toString());

    refetch(activeLabels);
  }

  function toggleLabel(labelId: number): void {
    let found = false;
    activeLabels = activeLabels.filter((l) => {
      if (labelId === l) {
        found = true;
        return false;
      }

      return true;
    });
    if (!found) {
      activeLabels = [...activeLabels, labelId];
    }
  }
</script>

<svelte:head>
  <title>OctoPuzzles</title>
  <meta
    name="description"
    content="Play and create your own Sudoku based puzzles at OctoPuzzles."
  />
  <meta property="og:image" content="https://octopuzzles.com/favicon.png" />
  <meta
    property="og:description"
    content="Play and create your own Sudoku based puzzles at OctoPuzzles."
  />
  <meta property="og:title" content="OctoPuzzles" />
</svelte:head>

<button
  title="Filter results"
  class="flex gap-1 items-center ml-auto mr-4 rounded-full hover:bg-gray-100 px-2 py-1"
  on:click={() => (showFilters = !showFilters)}
>
  <span class="text-sm text-gray-500">Filter</span>
  <span class="w-6 h-6"><Filters /></span>
</button>

{#if showFilters}
  <div class="w-full shadow-inner bg-gray-100 py-4 px-4 mt-4">
    <h2 class="font-semibold mb-2">Labels</h2>
    <div class="flex gap-2 flex-wrap">
      {#each data.labels as label}
        {@const selected = activeLabels.includes(label.id)}
        <button on:click={() => toggleLabel(label.id)}>
          <PuzzleLabel {label} {selected} />
        </button>
      {/each}
    </div>

    <div>
      <Button variant="primary" class="mt-4 ml-auto flex" on:click={search}>Search</Button>
      <Button
        variant="subtle"
        on:click={() => {
          if (activeLabels.length > 0) {
            activeLabels = [];
            search();
          }
        }}>Clear filters</Button
      >
    </div>
  </div>
{/if}

{#if sudokus != null}
  <SudokuList
    hasNextPage={sudokus.nextCursor != null}
    {loadNextPage}
    {loading}
    sudokus={sudokus.sudokus ?? null}
  />
{/if}
