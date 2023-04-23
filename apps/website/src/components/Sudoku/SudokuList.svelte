<script lang="ts">
  import { SudokuDisplay } from '@octopuzzles/sudoku-display';
  import { formatDistanceToNowStrict } from 'date-fns';
  import { Button, Spinner, PuzzleLabel } from '@octopuzzles/ui';
  import Trash from 'phosphor-svelte/lib/Trash/Trash.svelte';
  import NotePencil from 'phosphor-svelte/lib/NotePencil/NotePencil.svelte';
  import type { User, Sudoku, Label } from '@octopuzzles/models';
  import { fillCluesWithDefaults } from '$utils/fillSudokuWithDefaults';

  export let sudokus:
    | (Sudoku & { user?: Pick<User, 'id' | 'username' | 'role'>; labels: Label[] })[]
    | null;
  export let hasNextPage: boolean;
  export let loading: boolean;
  export let loadNextPage: () => Promise<void>;
  export let deleteSudoku: ((id: number) => void) | undefined = undefined;
</script>

{#if !sudokus && loading}
  <div class="w-full flex justify-center mt-4">
    <Spinner class="w-40 h-40 text-orange-500" />
  </div>
{/if}
{#if sudokus}
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-8 p-4"
  >
    {#each sudokus as sudoku (sudoku.id)}
      {#if sudoku}
        <a
          class="shadow-md items-center col-span-1 flex flex-col border rounded-md overflow-hidden cursor-pointer"
          href="/sudoku/{sudoku.id}"
          data-sveltekit-preload-data
        >
          <div class="h-96 w-full p-4 justify-center">
            <SudokuDisplay clues={fillCluesWithDefaults(sudoku)} />
          </div>
          <div class="h-32 bg-gray-100 w-full border-t p-2">
            <div class="flex justify-between h-20">
              <div class="flex flex-col justify-around">
                <h2 class="text-gray-700 text-lg max-w-xs font-medium truncate">
                  {sudoku.title ?? '[untitled]'}
                </h2>
                <div class="flex text-sm text-gray-500">
                  {#if sudoku.user}
                    <a class="cursor-pointer hover:text-gray-800" href={`/user/${sudoku.user.id}`}>
                      {sudoku.user.username}
                    </a>
                  {:else}
                    <p class="text-sm text-gray-500">[deleted]</p>
                  {/if}
                  <span class="mx-1">•</span>
                  {#if sudoku.publicSince}
                    <p>{formatDistanceToNowStrict(sudoku.publicSince)} ago</p>
                  {:else}
                    <p class="text-orange-500">Not public</p>
                  {/if}
                  <span class="mx-1">•</span>
                  <p class="">
                    {sudoku.points ?? 0} upvote{Math.abs(sudoku.points) !== 1 ? 's' : ''}
                  </p>
                  {#if sudoku.difficulty != null}
                    <span class="mx-1">•</span>
                    <p title="{sudoku.difficulty}/5 difficulty">{sudoku.difficulty} / 5</p>
                  {/if}
                </div>
              </div>
              {#if deleteSudoku}
                <div class="flex flex-col items-end justify-around">
                  <a
                    class="rounded-full w-7 h-7 p-1 hover:bg-gray-200"
                    href="/sudoku/editor?id={sudoku.id}"><NotePencil size={20} /></a
                  >
                  <button
                    class="rounded-full w-7 h-7 p-1 hover:text-red-500 hover:bg-red-100"
                    on:click|preventDefault={() => deleteSudoku?.(sudoku.id)}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              {/if}
            </div>

            <div class="h-8 w-full flex items-center overflow-y-hidden overflow-x-auto">
              {#if sudoku.labels}
                <div class="flex gap-2">
                  {#each sudoku.labels as label}
                    <PuzzleLabel {label} />
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </a>
      {/if}
    {/each}
  </div>

  <div class="flex justify-center my-4">
    {#if hasNextPage}
      <Button variant="secondary" {loading} on:click={() => loadNextPage()}>Load more</Button>
    {/if}
  </div>
{/if}
