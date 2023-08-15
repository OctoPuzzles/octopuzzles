<script lang="ts">
  import { DangerActionModal } from '@octopuzzles/ui';
  import SudokuList from '$components/Sudoku/SudokuList.svelte';
  import { trpc } from '$lib/trpc/client';
  import type { PageData } from './$types';
  import { page } from '$app/stores';

  export let data: PageData;

  let nextCursor: Date | null = null;
  $: nextCursor = data.sudokus.nextCursor;

  let loading = false;

  async function loadNextPage(): Promise<void> {
    loading = true;
    const sudokuData = await trpc($page).sudokus.saved.query({
      limit: 24,
      cursor: nextCursor ?? undefined
    });
    data.sudokus = sudokuData;
    nextCursor = sudokuData.nextCursor;
    loading = false;
  }

  let showDeleteSavedGameModal = false;
  let savedGameToDelete: number | undefined = undefined;
</script>

<svelte:head>
  <title>Saved Sudokus | OctoPuzzles</title>
  <meta name="description" content="Saved Sudokus" />
  <meta property="og:image" content="https://octopuzzles.com/favicon.png" />
  <meta property="og:description" content="Saved Sudokus" />
  <meta property="og:title" content="Saved Sudokus | OctoPuzzles" />
</svelte:head>

{#if data}
  <h1 class="text-center text-4xl font-bold mb-4">Saved Sudokus</h1>
{/if}
<SudokuList
  hasNextPage={data.sudokus.nextCursor != null}
  {loadNextPage}
  {loading}
  sudokus={data.sudokus.sudokus ?? null}
  deleteSudoku={(id) => {
    showDeleteSavedGameModal = true;
    savedGameToDelete = id;
  }}
/>

<DangerActionModal
  bind:isOpen={showDeleteSavedGameModal}
  onAccept={async () => {
    if (savedGameToDelete == null) return;
    await trpc($page).savedGames.delete.mutate({ sudokuId: savedGameToDelete });
    showDeleteSavedGameModal = false;
  }}
/>
