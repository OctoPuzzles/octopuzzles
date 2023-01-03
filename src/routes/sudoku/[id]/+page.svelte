<script lang="ts">
  import html2canvas from 'html2canvas';
  import SudokuGame from '$components/Sudoku/Game.svelte';
  import SudokuInfo from '$components/Sudoku/SudokuInfo.svelte';
  import {
    description,
    editorHistory,
    gameHistory,
    sudokuTitle,
    wrongCells,
    solution
  } from '$stores/sudokuStore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { openModal } from '$stores/modalStore';
  import FinishedSudokuModal from '$components/Modals/FinishedSudokuModal.svelte';
  import type { PageData } from './$types';
  import { walkthroughStore } from '$stores/walkthroughStore';
  import { fillWalkthroughStore } from '$utils/fillWalkthroughStore';
  import trpc from '$lib/client/trpc';
  import { scanner } from '$stores/sudokuStore/scanner';
  import { settings } from '$stores/settingsStore';

  export let data: PageData;

  $: if (data.walkthrough?.steps) {
    // Just so ts will shut up
    fillWalkthroughStore(data.walkthrough);
  } else {
    walkthroughStore.set([]);
  }

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

  onMount(async () => {
    let sud = data.sudoku;
    if (!sud) {
      await goto('/');
      return;
    }

    $sudokuTitle = sud.title;
    $description = sud.description;
    $solution = sud.solution?.numbers ?? null;

    editorHistory.reset({
      borderclues: sud.borderclues ?? undefined,
      cellclues: sud.cellclues ?? undefined,
      regions: sud.regions ?? undefined,
      givens: sud.givens ?? undefined,
      cells: sud.cells ?? undefined,
      editorcolors: sud.colors ?? undefined,
      cages: sud.extendedcages ?? undefined,
      paths: sud.paths ?? undefined,
      dimensions: sud.dimensions,
      logic: sud.logic ?? undefined
    });
    if (data.gameData) {
      gameHistory.set(data.gameData);
    } else {
      gameHistory.reset();
    }

    trpc().mutation('userStats:viewed', { sudokuId: sud.id });
  });

  let givens = editorHistory.getClue('givens');
  let borderClues = editorHistory.getClue('borderclues');
  let cellClues = editorHistory.getClue('cellclues');
  let regions = editorHistory.getClue('regions');
  let cells = editorHistory.getClue('cells');
  let editorColors = editorHistory.getClue('editorcolors');
  let cages = editorHistory.getClue('cages');
  let paths = editorHistory.getClue('paths');
  let dimensions = editorHistory.getClue('dimensions');
  let logic = editorHistory.getClue('logic');

  let values = gameHistory.getValue('values');
  let gameColors = gameHistory.getValue('colors');
  let cornermarks = gameHistory.getValue('cornermarks');
  let centermarks = gameHistory.getValue('centermarks');
  let notes = gameHistory.getValue('notes');

  let generalSettings = settings.getGroup('general');

  function checkSolution(numbers: string[][]): boolean {
    $wrongCells = [];

    const complete = !$values.some((r, i) =>
      r.some((v, j) => v === '' && $givens[i][j] === '' && $cells[i][j] === true)
    );

    const verificationMode = $generalSettings?.verificationMode ?? 'OnDemand';
    if (verificationMode === 'OnComplete' && !complete) return false;

    if ($solution != null) {
      if ($solution.length !== numbers.length || $solution[0].length !== numbers[0].length) {
        return false;
      }
    }

    const errorCells = scanner.getErrorCells($solution);
    if (verificationMode === 'OnInput' || (complete && verificationMode === 'OnComplete')) {
      $wrongCells = errorCells;
    }

    return complete && errorCells.length === 0;
  }

  function showDoneModal(): void {
    if (data.sudoku?.id) {
      openModal(FinishedSudokuModal, {
        sudokuId: data.sudoku.id,
        takeScreenshot,
        finishTime: `${days}${hours}${minutes}:${seconds}`
      });
    }
  }

  $: if (checkSolution($values)) {
    clearInterval(timer);
    trpc().mutation('userStats:solved', { sudokuId: data.sudoku.id, solveTime: t });
    showDoneModal();
  }

  function takeScreenshot(): void {
    const sudokuDisplay = document.querySelector<HTMLElement>('#sudoku-display');
    if (sudokuDisplay == null) return;

    html2canvas(sudokuDisplay).then((canvas) => {
      const base64image = canvas.toDataURL('image/png');
      window.open(base64image);
    });
  }
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
  givens={$givens}
  borderClues={$borderClues}
  cellClues={$cellClues}
  regions={$regions}
  cells={$cells}
  editorColors={$editorColors}
  cages={$cages}
  paths={$paths}
  dimensions={$dimensions}
  logic={$logic}
  values={$values}
  gameColors={$gameColors}
  cornermarks={$cornermarks}
  centermarks={$centermarks}
  notes={$notes}
/>

<SudokuInfo sudoku={data.sudoku} {takeScreenshot} />
