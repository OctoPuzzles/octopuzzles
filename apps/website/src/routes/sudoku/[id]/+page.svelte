<script lang="ts">
  import html2canvas from 'html2canvas';
  import { SudokuGame } from '@octopuzzles/sudoku-game';
  import SudokuInfo from '$components/Sudoku/SudokuInfo.svelte';
  import { onMount } from 'svelte';
  import FinishedSudokuModal from '$components/Modals/FinishedSudokuModal.svelte';
  import type { PageData } from './$types';
  import { me } from '$stores/meStore';
  import FileArrowUp from 'phosphor-svelte/lib/FileArrowUp/FileArrowUp.svelte';
  import ExportToFPuzzles from '$components/Modals/exportToFPuzzles.svelte';
  import { fillCluesWithDefaults } from '$utils/fillSudokuWithDefaults';
  import { defaultUserInputs } from '@octopuzzles/sudoku-utils';

  export let data: PageData;

  const sudokuTitle = data.sudoku.title;
  const description = data.sudoku.description;
  let walkthrough = data.walkthrough?.steps ?? [];
  const clues = fillCluesWithDefaults(data.sudoku);
  let userInputs = data.gameData ?? defaultUserInputs(data.sudoku.dimensions);
  const scannerSettings = me.settings;

  // TIMER: one that does not run when the tab is inactive, but runs as if it had.
  let now = Date.now();
  const start = Date.now();
  let timer: ReturnType<typeof setInterval>;

  $: t = Math.floor((now - start) / 1000);

  $: seconds = `0${t % 60}`.slice(-2);
  $: minutes = `0${Math.floor(t / 60) % 60}`.slice(-2);
  $: hours = t >= 3600 ? `0${Math.floor(t / 3600) % 24}`.slice(-2) + ':' : '';
  $: days = t >= 86400 ? Math.floor(t / 86400) + 'd ' : '';

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

  let showFinishedSudokuModal = false;
  let exportToFPuzzlesModalIsOpen = false;
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
        {days}
        {hours}{minutes}:{seconds}
      </span>
    </div>
  </div>
</div>

<SudokuGame
  scannerSettings={$scannerSettings.scanner}
  onScannerSettingsChange={(newSettings) => me.saveSettings({ scanner: newSettings })}
  onDone={() => {
    clearInterval(timer);
    showFinishedSudokuModal = true;
  }}
  solution={data.sudoku.solution ?? undefined}
  bind:walkthrough
  {clues}
  bind:userInputs
>
  <button
    on:click={() => (exportToFPuzzlesModalIsOpen = true)}
    class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
    title="Export"
  >
    <FileArrowUp size={32} />
  </button>
</SudokuGame>
<ExportToFPuzzles
  bind:isOpen={exportToFPuzzlesModalIsOpen}
  {clues}
  {userInputs}
  title={sudokuTitle}
  {description}
/>

<SudokuInfo sudoku={data.sudoku} {takeScreenshot} />

<FinishedSudokuModal
  bind:isOpen={showFinishedSudokuModal}
  sudokuId={data.sudoku.id}
  {takeScreenshot}
  finishTime={`${days}${hours}${minutes}:${seconds}`}
/>
