<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type {
    EditorHistoryStep,
    Position,
    GameData,
    MouseDownHandler,
    MouseEnterHandler
  } from '@octopuzzles/models';
  import BorderClues from './sudoku-clues/borderclues/BorderClues.svelte';
  import CellClues from './sudoku-clues/CellClues.svelte';
  import Cells from './sudoku-clues/Cells.svelte';
  import Colors from './sudoku-clues/Colors.svelte';
  import CornerMarks from './sudoku-clues/CornerMarks.svelte';
  import CenterMarks from './sudoku-clues/CenterMarks.svelte';
  import KillerCages from './sudoku-clues/killercages/KillerCages.svelte';
  import Numbers from './sudoku-clues/Numbers.svelte';
  import Paths from './sudoku-clues/paths/Paths.svelte';
  import Notes from './sudoku-clues/Notes.svelte';
  import Logic from './sudoku-clues/Logic.svelte';
  import Regions from './sudoku-clues/Regions.svelte';
  import Interface from './sudoku-clues/Interface.svelte';
  import Modifiers from './sudoku-clues/Modifiers.svelte';

  export let clues: EditorHistoryStep;
  export let gameData: GameData | undefined = undefined;
  export let selectedCells: Position[] | undefined = undefined;
  export let highlightedCells: Position[] | undefined = undefined;
  export let wrongCells: Position[] | undefined = undefined;

  export let onClickNote: ((note: string, position: Position) => void) | undefined = undefined;
  export let handleMouseDown: MouseDownHandler | undefined = undefined;
  export let handleMouseEnter: MouseEnterHandler | undefined = undefined;

  export let isEditor = false;

  $: interactive = onClickNote != null || handleMouseDown != null || handleMouseEnter != null;
</script>

<svg
  viewBox="-2 -2 {clues.dimensions.columns * CELL_SIZE + 4} {clues.dimensions.rows * CELL_SIZE + 4}"
  class="max-h-full max-w-full"
>
  <Colors editorColors={clues.colors} cellValues={gameData?.cellValues} />
  {#if interactive}
    <g id="highlights">
      {#if wrongCells}
        {#each wrongCells as cell}
          <rect
            class="fill-current text-red-200"
            x={CELL_SIZE * cell.column}
            y={CELL_SIZE * cell.row}
            width={CELL_SIZE}
            height={CELL_SIZE}
            vector-effect="non-scaling-size"
          />
        {/each}
      {/if}
      {#if selectedCells}
        {#each selectedCells as cell}
          <rect
            class="fill-current text-orange-300 text-opacity-40"
            x={CELL_SIZE * cell.column}
            y={CELL_SIZE * cell.row}
            width={CELL_SIZE}
            height={CELL_SIZE}
            vector-effect="non-scaling-size"
          />
        {/each}
      {/if}
      {#if highlightedCells}
        {#each highlightedCells as cell}
          <rect
            class="fill-current text-blue-100"
            x={CELL_SIZE * cell.column}
            y={CELL_SIZE * cell.row}
            width={CELL_SIZE}
            height={CELL_SIZE}
            vector-effect="non-scaling-size"
          />
        {/each}
      {/if}
    </g>

    <Interface
      cells={clues.cells}
      dimensions={clues.dimensions}
      {isEditor}
      {handleMouseDown}
      {handleMouseEnter}
    />
  {/if}
  <Paths paths={clues.paths} />
  <KillerCages cages={clues.extendedcages} dimensions={clues.dimensions} />
  <Cells cells={clues.cells} />
  <Notes notes={gameData?.notes} {onClickNote} />
  <Regions regions={clues.regions} dimensions={clues.dimensions} />
  <BorderClues borderClues={clues.borderclues} />
  <CellClues cellClues={clues.cellclues} />
  <Modifiers cellValues={gameData?.cellValues} />
  <CornerMarks cellValues={gameData?.cellValues} givens={clues.givens} />
  <CenterMarks cellValues={gameData?.cellValues} givens={clues.givens} />
  <Numbers cellValues={gameData?.cellValues} givens={clues.givens} />
  <Logic logic={clues.logic} dimensions={clues.dimensions} />
</svg>
