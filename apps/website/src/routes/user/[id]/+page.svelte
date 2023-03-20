<script lang="ts">
  import DangerActionModal from '$components/Modals/DangerActionModal.svelte';
  import SudokuList from '$components/Sudoku/SudokuList.svelte';
  import trpc from '$lib/client/trpc';
  import type { PageData } from './$types';

  export let data: PageData;

  let nextCursor: Date | null = null;
  $: nextCursor = data.sudokus.nextCursor;

  let loading = false;

  async function loadNextPage() {
    loading = true;
    let sudokuData = await trpc().query('sudokus:search', {
      labels: [],
      limit: 24,
      userId: data.user.id,
      cursor: nextCursor ?? undefined
    });
    data.sudokus = sudokuData;
    nextCursor = sudokuData.nextCursor;
    loading = false;
  }

  let showDeleteSudokuModal = false;
  let sudokuToDelete: number | undefined = undefined;
</script>

<svelte:head>
  <title>{data.user.username} | OctoPuzzles</title>
  <meta name="description" content="Sudokus made by {data.user.username}" />
  <meta property="og:image" content="https://octopuzzles.com/favicon.png" />
  <meta property="og:description" content="Sudokus made by {data.user.username}" />
  <meta property="og:title" content="{data.user.username} | OctoPuzzles" />
</svelte:head>

{#if data}
  <h1 class="text-center text-4xl font-bold mb-4">
    Sudokus by {data.user.username == data.me?.username ? 'you' : data.user.username}
  </h1>
{/if}
<SudokuList
  hasNextPage={data.sudokus.nextCursor != null}
  {loadNextPage}
  {loading}
  sudokus={data.sudokus.sudokus ?? null}
  deleteSudoku={(id) => {
    if (data.me != null && data.me.id === data.user.id) {
      showDeleteSudokuModal = true;
      sudokuToDelete = id;
    }
  }}
/>

<DangerActionModal
  bind:isOpen={showDeleteSudokuModal}
  onAccept={async () => {
    if (sudokuToDelete == null) return;
    await trpc().mutation('sudokus:delete', { id: sudokuToDelete });
    showDeleteSudokuModal = false;
  }}
/>
