<script lang="ts">
  import SudokuList from '$components/Sudoku/SudokuList.svelte';
  import { PuzzleLabel, Button, Input, DualRange } from '@octopuzzles/ui';
  import { Filters } from '@octopuzzles/icons';
  import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass/MagnifyingGlass.svelte';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import { trpc } from '$lib/trpc/client';

  export let data: PageData;
  let sudokus = data.sudokuData;

  let query = '';
  let difficultyRange: [number, number] = [0, 5];
  let currentCursor: Date | null = null;
  let nextCursor: Date | null = null;
  $: nextCursor = sudokus.nextCursor;

  let loading = false;

  async function loadNextPage(): Promise<void> {
    loading = true;
    currentCursor = nextCursor;
    const sudokuData = await trpc($page).sudokus.search.query({
      query,
      difficultyRange,
      labels: [],
      limit: 24,
      cursor: nextCursor ?? undefined
    });
    sudokus = sudokuData;
    nextCursor = sudokuData.nextCursor;
    loading = false;
  }

  async function refetch(labels: number[]): Promise<void> {
    loading = true;
    const sudokuData = await trpc($page).sudokus.search.query({
      query,
      difficultyRange,
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

  function handleKeydown(k: KeyboardEvent): void {
    if (k.key === 'Enter') {
      search();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

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

<div class="mb-4 flex justify-center">
  <div class="flex items-center gap-2">
    <Input placeholder="Search..." class="w-[400px]" bind:value={query} />
    <Button on:click={search} variant="primary" {loading}
      ><div class="flex items-center gap-2"><MagnifyingGlass /> Search</div></Button
    >
    <Button variant="subtle" title="Filter results" on:click={() => (showFilters = !showFilters)}>
      <div class="flex items-center gap-1 text-sm">
        Filter <span class="w-6 h-6"><Filters /></span>
      </div>
    </Button>
  </div>
</div>

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

    <div class="mb-8 mt-8 inline-block">
      <h2 class="font-semibold mb-2">Difficulty</h2>
      <div class="w-96">
        <DualRange
          id="difficulty"
          min={0}
          max={5}
          formatter={(v) => (v === 0 ? 'None' : String(v))}
          bind:values={difficultyRange}
          all="label"
          pips
        />
      </div>
    </div>

    <div>
      <Button
        variant="default"
        on:click={() => {
          difficultyRange = [0, 5];
          if (activeLabels.length > 0) {
            activeLabels = [];
          }
          search();
        }}>Clear filters</Button
      >
      <Button variant="primary" on:click={search}>Apply filters</Button>
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
