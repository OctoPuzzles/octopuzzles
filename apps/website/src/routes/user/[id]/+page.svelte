<script lang="ts">
  import DangerActionModal from '$components/Modals/DangerActionModal.svelte';
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
    const sudokuData = await trpc($page).sudokus.search.query({
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
    Sudokus by {data.user.username === data.me?.username ? 'you' : data.user.username}
  </h1>
{/if}
<SudokuList
  hasNextPage={data.sudokus.nextCursor != null}
  {loadNextPage}
  {loading}
  sudokus={data.sudokus.sudokus ?? null}
  deleteSudoku={data.me == null
    ? undefined
    : (id) => {
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
    await trpc($page).sudokus.delete.mutate({ id: sudokuToDelete });
    showDeleteSudokuModal = false;
  }}
/>
