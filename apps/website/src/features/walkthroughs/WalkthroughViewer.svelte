<script lang="ts">
  import { gameHistory } from '$stores/sudokuStore';
  import { SudokuDisplay } from '@octopuzzles/sudoku-display';
  import ArrowsCounterClockwise from 'phosphor-svelte/lib/ArrowsCounterClockwise/ArrowsCounterClockwise.svelte';
  import AppWindow from 'phosphor-svelte/lib/AppWindow/AppWindow.svelte';
  import { page } from '$app/stores';
  import classNames from 'classnames';
  import { HTMLContent } from '@octopuzzles/ui';
  import { compressToBase64 } from '@octopuzzles/utils';
  import Play from 'phosphor-svelte/lib/Play/Play.svelte';
  import type { EditorHistoryStep } from '@octopuzzles/models';
  import type { WalkthroughStep } from '@octopuzzles/models';

  const inModal = !$page.url.pathname.endsWith('/walkthrough');

  export let clues: EditorHistoryStep;
  export let walkthrough: WalkthroughStep[];
</script>

<div class="h-full flex-1 overflow-y-hidden flex flex-col">
  <div
    class={classNames(
      'w-full flex-1 p-2 relative',
      inModal && 'bg-gray-100 border-b border-gray-200'
    )}
  >
    {#if inModal}
      <a
        class="absolute right-1 top-1"
        href={`${$page.url.pathname}/walkthrough`}
        title="Open in another tab"
        target="_blank"
        rel="noreferrer noopener"
      >
        <AppWindow />
      </a>
    {/if}
    <h2 class="text-center font-bold text-2xl">Walkthrough</h2>
  </div>

  <div class="shrink overflow-y-auto p-4">
    {#each walkthrough as { step, description }, i}
      <div>
        <div class="flex space-x-4 items-center mb-2 mt-2">
          <h4 class="font-medium">Step {i + 1}</h4>
          {#if inModal}
            <button
              class="w-6 h-6 rounded-full p-1 hover:bg-gray-100 hover:text-gray-600"
              on:click={() => {
                gameHistory.set(step);
              }}
              title="Reset to this step"><ArrowsCounterClockwise size={16} /></button
            >
          {:else}
            <a
              class="w-6 h-6 rounded-full p-1 hover:bg-gray-100 hover:text-gray-600"
              href={`${$page.url.pathname.replace(
                '/walkthrough',
                '?data=' + compressToBase64(step)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open puzzle at this step in new tab"><Play size={16} /></a
            >
          {/if}
        </div>
      </div>
      <div class="grid gap-2 grid-cols-2">
        <div>
          <SudokuDisplay {clues} userInputs={step} />
        </div>
        <div>
          <HTMLContent content={description} />
        </div>
      </div>
    {/each}
  </div>
</div>
