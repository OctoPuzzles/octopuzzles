<script lang="ts">
  import ControllerHelpModal from '$components/Modals/ControllerHelpModal.svelte';
  import ExportToFPuzzles from '$components/Modals/exportToFPuzzles.svelte';
  import ImportFromFPuzzles from '$components/Modals/ImportFromFPuzzles.svelte';
  import BorderCluesIcon from '$icons/BorderClues.svelte';
  import CellCluesIcon from '$icons/CellClues.svelte';
  import CellsIcon from '$icons/Cells.svelte';
  import ColorPicker from '$icons/ColorPicker.svelte';
  import DimensionsIcon from '$icons/Dimensions.svelte';
  import GivensIcon from '$icons/Givens.svelte';
  import KillerCagesIcon from '$icons/KillerCages.svelte';
  import LogicIcon from '$icons/Logic.svelte';
  import PathsIcon from '$icons/Paths.svelte';
  import RegionsIcon from '$icons/Regions.svelte';
  import { openModal } from '$stores/modalStore';
  import { editorHistory, inputMode } from '$stores/sudokuStore';
  import type { InputMode } from '$types';
  import SquareButton from '$ui/SquareButton.svelte';
  import classNames from 'classnames';
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise/ArrowCounterClockwise.svelte';
  import ArrowUUpLeft from 'phosphor-svelte/lib/ArrowUUpLeft/ArrowUUpLeft.svelte';
  import ArrowUUpRight from 'phosphor-svelte/lib/ArrowUUpRight/ArrowUUpRight.svelte';
  import FileArrowDown from 'phosphor-svelte/lib/FileArrowDown/FileArrowDown.svelte';
  import FileArrowUp from 'phosphor-svelte/lib/FileArrowUp/FileArrowUp.svelte';
  import Question from 'phosphor-svelte/lib/Question/Question.svelte';
  import { onMount } from 'svelte';
  import BorderClues from './components/BorderClues.svelte';
  import CellClues from './components/CellClues.svelte';
  import Cells from './components/Cells.svelte';
  import Dimensions from './components/Dimensions.svelte';
  import EditorColors from './components/EditorColors.svelte';
  import Givens from './components/Givens.svelte';
  import KillerCages from './components/KillerCages.svelte';
  import Logic from './components/Logic.svelte';
  import Paths from './components/Paths.svelte';
  import Regions from './components/Regions.svelte';

  const controls: Record<
    string,
    { icon: typeof GivensIcon; controller: typeof Givens; label: string }
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
  };

  $: controller = $inputMode && controls[$inputMode] ? controls[$inputMode]?.controller : Givens;
  $: openControl = $inputMode && controls[$inputMode] ? controls[$inputMode]?.label : 'Givens';

  function setInputMode(newInputMode: string): void {
    $inputMode = newInputMode as InputMode;
  }

  onMount(() => {
    $inputMode = 'givens';
  });

  function showHelp(): void {
    openModal(ControllerHelpModal, { mode: 'editor' });
  }

  function showImportFromFPuzzlesModal(): void {
    openModal(ImportFromFPuzzles);
  }

  function showExportToFPuzzlesModal(): void {
    openModal(ExportToFPuzzles);
  }
</script>

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
      disabled={!editorHistory.canUndo}
      on:click={() => {
        editorHistory.undo();
      }}
    >
      <ArrowUUpLeft size={32} />
    </SquareButton>
    <SquareButton
      text="Redo"
      disabled={!editorHistory.canRedo}
      on:click={() => {
        editorHistory.redo();
      }}
    >
      <ArrowUUpRight size={32} />
    </SquareButton>
    <SquareButton
      text="Restart"
      on:click={() => {
        editorHistory.reset();
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

    <button
      on:click={showExportToFPuzzlesModal}
      class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
      title="Export"
    >
      <FileArrowUp size={32} />
    </button>
    <button
      on:click={showImportFromFPuzzlesModal}
      class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
      title="Import from f-puzzles"
    >
      <FileArrowDown size={32} />
    </button>
  </div>
</div>
