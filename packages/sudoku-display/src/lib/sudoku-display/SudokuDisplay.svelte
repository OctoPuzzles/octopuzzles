<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { EditorHistoryStep, GameHistoryStep, Position } from '@octopuzzles/models';
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
  import type {
    OnClickCellHandler,
    OnEnterCellHandler,
    OnMouseDownHitboxHandler,
    OnMouseEnterHitboxHandler
  } from '$lib/types';

  export let clues: EditorHistoryStep;
  export let userInputs: GameHistoryStep | undefined = undefined;
  export let selectedCells: Position[] | undefined = undefined;
  export let highlightedCells: Position[] | undefined = undefined;
  export let wrongCells: Position[] | undefined = undefined;

  /** Function that is called whenever a note is clicked. The position corresponds to the cell that is clicked */
  export let onClickNote: ((note: string, position: Position) => void) | undefined = undefined;
  /**
   * Function that should be called when a user clicks on a cell.
   * This detects clicks in the whole cell, rather than only the center, like the `onClickCellCenter`
   */
  export let onClickCell: OnClickCellHandler | undefined = undefined;
  /**
   * Function that should be called when a users mouse enters a cell.
   * This detects a mouse that enters the cell AND when the mouse is held down
   */
  export let onEnterCell: OnEnterCellHandler | undefined = undefined;
  /**
   * Function that gets called when a user presses down on either a cell center, border or corner.
   * This detects clicks on a small buffer around each object, so it is easier to hit the border and corners.
   * Hence "center" clicks are not detected on the whole cell.
   *
   * The position is adjusted, so the
   * - top left cell has a corner of { row: 0, column: 0 }
   * - a center of { row: 0.5, column: 0.5 }
   * - a vertical border of { row: 0.5, column: 0 }  and
   * - horizontal border of { row: 0, column: 0.5 }
   *
   * If this is defined, the `onClickCell` and `onEnterCell` no longer fire because of SVG not bubbling.
   */
  export let onMouseDownHitbox: OnMouseDownHitboxHandler | undefined = undefined;
  /**
   * Function that gets called when a users mouse enters either a cell center, border or corner AND their mouse is held down.
   * This detects a small buffer around each object, so it is easier to hit the border and corners.
   * Hence "center" clicks are not detected on the whole cell.
   *
   * The position is adjusted, so the
   * - top left cell has a corner of { row: 0, column: 0 }
   * - a center of { row: 0.5, column: 0.5 }
   * - a vertical border of { row: 0.5, column: 0 }  and
   * - horizontal border of { row: 0, column: 0.5 }
   *
   * If this is defined, the `onClickCell` and `onEnterCell` no longer fire because of SVG not bubbling.
   */
  export let onMouseEnterHitbox: OnMouseEnterHitboxHandler | undefined = undefined;

  export let isEditor = false;

  $: interactive = onClickNote != null || onClickCell != null || onEnterCell != null;
</script>

<svg
  viewBox="-2 -2 {clues.dimensions.columns * CELL_SIZE + 4} {clues.dimensions.rows * CELL_SIZE + 4}"
  class="max-h-full max-w-full"
>
  <Colors
    editorColors={clues.colors}
    gameColors={userInputs?.colors}
    dimensions={clues.dimensions}
  />
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
      {onClickCell}
      {onEnterCell}
      {onMouseDownHitbox}
      {onMouseEnterHitbox}
    />
  {/if}
  <Paths paths={clues.paths} />
  <KillerCages cages={clues.extendedcages} dimensions={clues.dimensions} />
  <Cells cells={clues.cells} />
  <Notes notes={userInputs?.notes} {onClickNote} />
  <Regions regions={clues.regions} dimensions={clues.dimensions} />
  <BorderClues borderClues={clues.borderclues} />
  <CellClues cellClues={clues.cellclues} />
  <CornerMarks
    values={userInputs?.values}
    givens={clues.givens}
    dimensions={clues.dimensions}
    cornermarks={userInputs?.cornermarks}
  />
  <CenterMarks
    values={userInputs?.values}
    givens={clues.givens}
    dimensions={clues.dimensions}
    centermarks={userInputs?.centermarks}
  />
  <Numbers values={userInputs?.values} givens={clues.givens} dimensions={clues.dimensions} />
  <Logic logic={clues.logic} dimensions={clues.dimensions} />
</svg>
