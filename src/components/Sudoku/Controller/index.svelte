<script lang="ts">
  import SquareButton from '$ui/SquareButton.svelte';
  import NumbersIcon from '$icons/Numbers.svelte';
  import GivensIcon from '$icons/Givens.svelte';
  import PathsIcon from '$icons/Paths.svelte';
  import BorderCluesIcon from '$icons/BorderClues.svelte';
  import CellCluesIcon from '$icons/CellClues.svelte';
  import RegionsIcon from '$icons/Regions.svelte';
  import KillerCagesIcon from '$icons/KillerCages.svelte';
  import DimensionsIcon from '$icons/Dimensions.svelte';
  import LogicIcon from '$icons/Logic.svelte';
  import CornerMarksIcon from '$icons/CornerMarks.svelte';
  import CenterMarksIcon from '$icons/CenterMarks.svelte';
  import CellsIcon from '$icons/Cells.svelte';
  import NotesIcon from '$icons/Notes.svelte';
  import ScannerIcon from '$icons/Scanner.svelte';
  import Numbers from './components/Numbers.svelte';
  import Regions from './components/Regions.svelte';
  import ArrowUUpLeft from 'phosphor-svelte/lib/ArrowUUpLeft/ArrowUUpLeft.svelte';
  import ArrowUUpRight from 'phosphor-svelte/lib/ArrowUUpRight/ArrowUUpRight.svelte';
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise/ArrowCounterClockwise.svelte';
  import FileArrowUp from 'phosphor-svelte/lib/FileArrowUp/FileArrowUp.svelte';
  import FileArrowDown from 'phosphor-svelte/lib/FileArrowDown/FileArrowDown.svelte';
  import Check from 'phosphor-svelte/lib/Check/Check.svelte';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk/FloppyDisk.svelte';
  import PersonSimpleWalk from 'phosphor-svelte/lib/PersonSimpleWalk/PersonSimpleWalk.svelte';
  import Question from 'phosphor-svelte/lib/Question/Question.svelte';
  import Givens from './components/Givens.svelte';
  import classNames from 'classnames';
  import BorderClues from './components/BorderClues.svelte';
  import CellClues from './components/CellClues.svelte';
  import {
    editorHistory,
    gameHistory,
    highlightedCells,
    inputMode,
    selectedCells
  } from '$stores/sudokuStore';
  import { onMount } from 'svelte';
  import Cells from './components/Cells.svelte';
  import EditorColors from './components/EditorColors.svelte';
  import GameColors from './components/GameColors.svelte';
  import ColorPicker from '$icons/ColorPicker.svelte';
  import KillerCages from './components/KillerCages.svelte';
  import Paths from './components/Paths.svelte';
  import Dimensions from './components/Dimensions.svelte';
  import Logic from './components/Logic.svelte';
  import CornerMarks from './components/CornerMarks.svelte';
  import CenterMarks from './components/CenterMarks.svelte';
  import { openModal } from '$stores/modalStore';
  import ControllerHelpModal from '$components/Modals/ControllerHelpModal.svelte';
  import { get } from 'svelte/store';
  import Notes from './components/Notes.svelte';
  import { isCommandKey } from '$utils/isCommandKey';
  import ImportFromFPuzzles from '$components/Modals/ImportFromFPuzzles.svelte';
  import ExportToFPuzzles from '$components/Modals/exportToFPuzzles.svelte';
  import WalkthroughModal from '$components/Modals/WalkthroughModal.svelte';
  import { page } from '$app/stores';
  import { mode } from '$stores/sudokuStore';
  import { walkthroughStore } from '$stores/walkthroughStore';
  import type { EditorHistoryStep, GameHistoryStep, InputMode } from '$types';
  import Scanner from './components/Scanner.svelte';
  import { scanner } from '$stores/sudokuStore/scanner';
  import trpc from '$lib/client/trpc';

  $: canUndo = $mode === 'editor' ? editorHistory.canUndo : gameHistory.canUndo;
  $: canRedo = $mode === 'editor' ? editorHistory.canRedo : gameHistory.canRedo;

  const editorControls: Record<
    string,
    { icon: typeof NumbersIcon; controller: typeof Numbers; label: string }
  > = {
    givens: { icon: GivensIcon, controller: Givens, label: 'Givens' },
    cellclues: { icon: CellCluesIcon, controller: CellClues, label: 'Cell clues' },
    borderclues: { icon: BorderCluesIcon, controller: BorderClues, label: 'Border clues' },
    paths: { icon: PathsIcon, controller: Paths, label: 'Paths' },
    cages: { icon: KillerCagesIcon, controller: KillerCages, label: 'Cages' },
    regions: { icon: RegionsIcon, controller: Regions, label: 'Regions' },
    logic: { icon: LogicIcon, controller: Logic, label: 'Logic' },
    dimensions: { icon: DimensionsIcon, controller: Dimensions, label: 'Dimensions' },
    cells: { icon: CellsIcon, controller: Cells, label: 'Cells' },
    editorcolors: { icon: ColorPicker, controller: EditorColors, label: 'Colors' }
  } as Record<
    keyof EditorHistoryStep,
    { icon: typeof NumbersIcon; controller: typeof Numbers; label: string }
  >;

  const gameControls: Record<
    string,
    { icon: typeof NumbersIcon; controller: typeof Numbers; label: string }
  > = {
    values: { icon: NumbersIcon, controller: Numbers, label: 'Numbers' },
    cornermarks: { icon: CornerMarksIcon, controller: CornerMarks, label: 'Corner marks' },
    centermarks: { icon: CenterMarksIcon, controller: CenterMarks, label: 'Center marks' },
    colors: { icon: ColorPicker, controller: GameColors, label: 'Colors' },
    notes: { icon: NotesIcon, controller: Notes, label: 'Notes' },
    scanner: { icon: ScannerIcon, controller: Scanner, label: 'Scanner' }
  } as Record<
    keyof GameHistoryStep,
    { icon: typeof NumbersIcon; controller: typeof Numbers; label: string }
  >;

  const controls = $mode === 'editor' ? editorControls : gameControls;

  $: controller = $inputMode && controls[$inputMode] ? controls[$inputMode]?.controller : Numbers;
  $: openControl = $inputMode && controls[$inputMode] ? controls[$inputMode]?.label : 'Numbers';

  function setInputMode(newInputMode: string): void {
    $inputMode = newInputMode as InputMode;
  }

  onMount(() => {
    if ($mode === 'editor') {
      $inputMode = 'givens';
    } else {
      $inputMode = 'values';
    }
  });

  let gameInputModePreShortcut = get(inputMode);

  function handleKeyboardShortcuts(k: KeyboardEvent): void {
    // Check whether any targets have explicitly stated that shortcuts should be ignored
    if (
      (k.target as HTMLElement)?.dataset?.ignoreshortcuts != null ||
      (k.target as HTMLElement).parentElement?.dataset.ignoreshortcuts != null
    )
      return;
    if ($mode === 'game') {
      // In notes mode, you should use command keys
      if ($inputMode === 'notes' && !isCommandKey(k)) return;
      switch (k.key) {
        case 'z':
          k.preventDefault();
          $inputMode = 'values';
          gameInputModePreShortcut = $inputMode;
          break;
        case 'x':
          k.preventDefault();
          $inputMode = 'cornermarks';
          gameInputModePreShortcut = $inputMode;
          break;
        case 'c':
          k.preventDefault();
          $inputMode = 'centermarks';
          gameInputModePreShortcut = $inputMode;
          break;
        case 'v':
          k.preventDefault();
          $inputMode = 'colors';
          gameInputModePreShortcut = $inputMode;
          break;
        case 'b':
          k.preventDefault();
          $inputMode = 'notes';
          gameInputModePreShortcut = $inputMode;
          break;
        case 'Shift':
          k.preventDefault();
          $inputMode = 'cornermarks';
          break;
        case 'Control':
          k.preventDefault();
          $inputMode = 'centermarks';
          break;
        case 's':
          k.preventDefault();
          if (!scanner.isScanning()) {
            scanner.startScan();
          } else {
            scanner.stopScan();
          }
          break;
        case 'a':
          k.preventDefault();
          if (scanner.isScanning()) {
            scanner.stopScan();
          }
          scanner.step();
          break;
        case 'h': {
          k.preventDefault();
          scanner.toggleSeen();

          highlightedCells.set(scanner.getHighlightedCells(get(selectedCells)));
          break;
        }
        case 't': {
          k.preventDefault();
          scanner.toggleTuples();

          highlightedCells.set(scanner.getHighlightedCells(get(selectedCells)));
          break;
        }
      }
    }
    // TODO: Handle editor
  }

  function handleKeyUp(k: KeyboardEvent): void {
    if ($mode === 'game' && isCommandKey(k)) {
      switch (k.key) {
        case 'Shift':
        case 'Control':
          k.preventDefault();
          $inputMode = gameInputModePreShortcut;
          break;
      }
    }
  }

  function showHelp(): void {
    openModal(ControllerHelpModal, { mode: $mode });
  }

  function showImportFromFPuzzlesModal(): void {
    openModal(ImportFromFPuzzles);
  }

  function showExportToFPuzzlesModal(): void {
    openModal(ExportToFPuzzles);
  }

  function showWalkthroughEditorModal(): void {
    openModal(WalkthroughModal, {
      editable: $page.url.pathname.includes('/sudoku/editor')
    });
  }

  function checkSolution(): void {}

  async function saveProgress(): Promise<void> {
    const values = get(gameHistory.getValue('values'));
    const cornermarks = get(gameHistory.getValue('cornermarks'));
    const centermarks = get(gameHistory.getValue('centermarks'));
    const notes = get(gameHistory.getValue('notes'));
    const colors = get(gameHistory.getValue('colors'));

    await trpc().mutation('savedGames:createOrUpdate', {
      sudokuId: parseInt($page.params.id),
      gameData: {
        values,
        cornermarks,
        centermarks,
        notes,
        colors
      }
    });
  }
</script>

<svelte:window on:keydown={handleKeyboardShortcuts} on:keyup={handleKeyUp} />

<div
  class="grid grid-rows-7 sm:grid-rows-6 grid-cols-4 sm:grid-cols-5 gap-2 max-w-96 sm:w-120 h-160 sm:h-140 relative"
>
  <!-- Main control container -->
  <div class="row-span-4 col-span-5 sm:col-span-4 bg-gray-100 rounded-md shadow">
    <svelte:component this={controller} />
  </div>

  <!-- Rightmost controls -->
  <div
    class="row-span-1 col-span-4 sm:row-span-5 sm:col-span-1 bg-gray-100 rounded-md shadow flex flex-row sm:flex-col items-center gap-2 px-2 sm:py-2 overflow-x-scroll sm:overflow-y-scroll"
  >
    {#each Object.entries(controls) as [im, info]}
      <SquareButton
        text={info.label}
        class={classNames({ 'ring-2 border-white ring-blue-500': info.label === openControl })}
        on:click={() => {
          setInputMode(im);
        }}
      >
        <svelte:component this={info.icon} />
      </SquareButton>
    {/each}
  </div>

  <!-- Bottom Controls -->
  <div
    class="row-span-1 col-span-5 sm:col-span-4 bg-gray-100 rounded-md shadow flex justify-evenly items-center"
  >
    <SquareButton
      text="Undo"
      disabled={!canUndo}
      on:click={() => {
        $mode === 'editor' ? editorHistory.undo() : gameHistory.undo();
      }}
    >
      <ArrowUUpLeft size={32} />
    </SquareButton>
    <SquareButton
      text="Redo"
      disabled={!canRedo}
      on:click={() => {
        $mode === 'editor' ? editorHistory.redo() : gameHistory.redo();
      }}
    >
      <ArrowUUpRight size={32} />
    </SquareButton>
    <SquareButton
      text="Restart"
      on:click={() => {
        if ($mode === 'editor') {
          editorHistory.reset();
          return;
        }
        gameHistory.reset();
      }}
    >
      <ArrowCounterClockwise size={32} />
    </SquareButton>
  </div>

  <!-- Aux Controls -->
  <div class="row-span-1 col-span-6 sm:col-span-5 flex justify-evenly items-center">
    <button
      on:click={showHelp}
      class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
      title="help"
    >
      <Question size={32} />
    </button>

    {#if $mode === 'game'}
      {#if !$page.url.pathname.includes('/sudoku/editor')}
        <button
          title="Check digits"
          class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
          on:click={checkSolution}
        >
          <Check size={32} />
        </button>
        <button
          title="Save for later"
          class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
          on:click={saveProgress}
        >
          <FloppyDisk size={32} />
        </button>
      {/if}

      {#if $page.url.pathname.includes('/sudoku/editor') || $walkthroughStore.length > 0}
        <button
          title="Walkthrough"
          class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
          on:click={showWalkthroughEditorModal}
        >
          <PersonSimpleWalk size={32} />
        </button>
      {/if}
    {/if}

    <button
      on:click={showExportToFPuzzlesModal}
      class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
      title="Export"
    >
      <FileArrowUp size={32} />
    </button>
    {#if $mode === 'editor'}
      <button
        on:click={showImportFromFPuzzlesModal}
        class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
        title="Import from f-puzzles"
      >
        <FileArrowDown size={32} />
      </button>
    {/if}
  </div>
</div>
