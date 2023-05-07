<script lang="ts">
  import html2canvas from 'html2canvas';
  import { SudokuGame } from '@octopuzzles/sudoku-game';
  import SudokuInfo from '$components/Sudoku/SudokuInfo.svelte';
  import { onMount } from 'svelte';
  import FinishedSudokuModal from '$components/Modals/FinishedSudokuModal.svelte';
  import type { PageData } from './$types';
  import { me } from '$stores/meStore';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk/FloppyDisk.svelte';
  import { fillCluesWithDefaults } from '$utils/fillSudokuWithDefaults';
  import { defaultGameData } from '@octopuzzles/sudoku-utils';
  import { page } from '$app/stores';
  import ExportButton from '$components/ExportButton.svelte';
  import { trpc } from '$lib/trpc/client';
  import { formatTime } from '@octopuzzles/utils';

  export let data: PageData;

  const sudokuId = data.sudoku.id;
  const sudokuTitle = data.sudoku.title;
  const description = data.sudoku.description;
  let walkthrough = data.walkthrough?.steps ?? [];
  const clues = fillCluesWithDefaults(data.sudoku);
  let gameData = data.gameData ?? defaultGameData(data.sudoku.dimensions);
  const scannerSettings = me.settings;

  // TIMER: one that does not run when the tab is inactive, but runs as if it had.
  let now = Date.now();
  const start = Date.now();
  let timer: ReturnType<typeof setInterval>;

  $: t = Math.floor((now - start) / 1000);

  // When the page is not visible, the timer should not run, but it should also not stop, but be incremented by the number of seconds the user was off screen
  function handleVisibilityChange(): void {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      timer = setInterval(() => {
        now = Date.now();
      }, 1000);
    }
  }
  onMount(() => {
    timer = setInterval(() => {
      now = Date.now();
    }, 1000);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  function takeScreenshot(): void {
    const sudokuDisplay = document.querySelector<HTMLElement>('#sudoku-display');
    if (sudokuDisplay == null) return;

    html2canvas(sudokuDisplay).then((canvas) => {
      const base64image = canvas.toDataURL('image/png');
      window.open(base64image);
    });
  }

  async function saveProgress(): Promise<void> {
    await trpc($page).savedGames.createOrUpdate.mutate({ sudokuId, gameData });
  }

  let showFinishedSudokuModal = false;
</script>

<svelte:head>
  <title>{data.sudoku.title} | OctoPuzzles</title>
  <meta name="description" content={data.sudoku?.description} />

  <meta property="og:title" content="{data.sudoku?.title ?? 'Sudoku'} | OctoPuzzles" />
  <meta property="og:description" content={data.sudoku?.description} />
  <meta property="og:url" content="http://www.octopuzzles.com/sudoku/{data.sudoku.id}" />
  <meta property="og:type" content="website" />
</svelte:head>

<!-- Header -->
<div class="flex items-center justify-center h-20 absolute top-0 w-full pointer-events-none">
  <div class="flex w-full justify-end sm:justify-center">
    <div class="flex flex-col items-center">
      <h1 class="text-xl font-medium text-center w-96 md:w-auto truncate">
        {data.sudoku.title}
      </h1>
      <span>
        {formatTime(t)}
      </span>
    </div>
  </div>
</div>

<SudokuGame
  scannerSettings={$scannerSettings.scanner}
  onScannerSettingsChange={(newSettings) => me.saveSettings({ scanner: newSettings })}
  onDone={() => {
    clearInterval(timer);

    const trpcClient = trpc($page);
    trpcClient.userStats.solved.mutate({ sudokuId, solveTime: t });
    if (data?.gameData) {
      trpcClient.savedGames.delete.mutate({ sudokuId });
    }

    showFinishedSudokuModal = true;
  }}
  solution={data.sudoku.solution ?? undefined}
  bind:walkthrough
  {clues}
  bind:gameData
>
  <button
    title="Save for later"
    class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
    on:click={saveProgress}
  >
    <FloppyDisk size={32} />
  </button>

  <ExportButton {clues} {gameData} {sudokuTitle} {description} />
</SudokuGame>

<SudokuInfo sudoku={data.sudoku} {takeScreenshot} />

<FinishedSudokuModal
  bind:isOpen={showFinishedSudokuModal}
  {sudokuId}
  {takeScreenshot}
  finishTime={formatTime(t)}
  {clues}
  {gameData}
/>
