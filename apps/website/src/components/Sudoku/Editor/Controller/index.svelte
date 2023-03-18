<script lang="ts">
  import ControllerHelpModal from '$components/Modals/ControllerHelpModal.svelte';
  import ExportToFPuzzles from '$components/Modals/exportToFPuzzles.svelte';
  import ImportFromFPuzzles from '$components/Modals/ImportFromFPuzzles.svelte';
  import ControllerSkeleton from '$components/Sudoku/ControllerSkeleton.svelte';
  import {
    BorderClues as BorderCluesIcon,
    CellClues as CellCluesIcon,
    Cells as CellsIcon,
    ColorPicker,
    Dimensions as DimensionsIcon,
    Givens as GivensIcon,
    KillerCages as KillerCagesIcon,
    Logic as LogicIcon,
    Paths as PathsIcon,
    Regions as RegionsIcon
  } from '@octopuzzles/icons';
  import { editorHistory, inputMode } from '$stores/sudokuStore';
  import type { InputMode } from '@octopuzzles/models';
  import { SquareButton, openModal } from '@octopuzzles/ui';
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
    extendedcages: { icon: KillerCagesIcon, controller: KillerCages, label: 'Cages' },
    regions: { icon: RegionsIcon, controller: Regions, label: 'Regions' },
    logic: { icon: LogicIcon, controller: Logic, label: 'Logic' },
    dimensions: { icon: DimensionsIcon, controller: Dimensions, label: 'Dimensions' },
    cells: { icon: CellsIcon, controller: Cells, label: 'Cells' },
    colors: { icon: ColorPicker, controller: EditorColors, label: 'Colors' }
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

<ControllerSkeleton
  menuItems={Object.entries(controls).map(([im, info]) => ({
    icon: info.icon,
    isSelected: info.label === openControl,
    onClick: () => setInputMode(im),
    title: info.label
  }))}
>
  <svelte:component this={controller} slot="main" />
  <svelte:fragment slot="bottom">
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
  </svelte:fragment>
  <svelte:fragment slot="aux">
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
  </svelte:fragment>
</ControllerSkeleton>
