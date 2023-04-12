<script lang="ts">
  import type {
    OnClickCellHandler,
    OnEnterCellHandler,
    OnMouseDownHitboxHandler,
    OnMouseEnterHitboxHandler
  } from '$lib/types';
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Cells, Dimensions } from '@octopuzzles/models';
  import { defaultCells } from '@octopuzzles/sudoku-utils';
  import { arrayfrom0ToN, isCommandKey } from '@octopuzzles/utils';

  export let cells: Cells;
  export let dimensions: Dimensions;
  export let isEditor = false;
  export let onClickCell: OnClickCellHandler | undefined = undefined;
  export let onEnterCell: OnEnterCellHandler | undefined = undefined;
  export let onMouseDownHitbox: OnMouseDownHitboxHandler | undefined = undefined;
  export let onMouseEnterHitbox: OnMouseEnterHitboxHandler | undefined = undefined;

  $: detectPenToolHits = onMouseDownHitbox != null || onMouseEnterHitbox != null;
  $: detectCellHits = (!detectPenToolHits && onClickCell != null) || onEnterCell != null;

  const CELL_CENTER_WIDTH_PERCENTAGE = 80;
  const CELL_CENTER_WIDTH = (CELL_SIZE * CELL_CENTER_WIDTH_PERCENTAGE) / 100;
  const BORDER_WIDTH = CELL_SIZE - CELL_CENTER_WIDTH;

  $: cells = !isEditor
    ? cells
    : defaultCells(
        dimensions.margins
          ? {
              rows: dimensions.rows + dimensions.margins.top + dimensions.margins.bottom,
              columns: dimensions.columns + dimensions.margins.left + dimensions.margins.right,
              margins: { left: 0, right: 0, top: 0, bottom: 0 }
            }
          : dimensions
      );

  let mouseDown = false;
</script>

<svelte:body on:mousedown={() => (mouseDown = true)} on:mouseup={() => (mouseDown = false)} />

<g id="interface" on:touchmove|preventDefault>
  <!-- Cells -->
  {#if detectCellHits}
    {#each cells as row, rowIndex}
      {#each row as cell, columnIndex}
        {#if cell}
          <rect
            on:mousedown={(e) =>
              onClickCell?.({ row: rowIndex, column: columnIndex }, isCommandKey(e))}
            on:mouseenter={(e) =>
              mouseDown && onEnterCell?.({ row: rowIndex, column: columnIndex }, isCommandKey(e))}
            class="fill-current cursor-pointer text-transparent hover:text-opacity-40"
            x={CELL_SIZE * columnIndex}
            y={CELL_SIZE * rowIndex}
            width={CELL_SIZE}
            height={CELL_SIZE}
            vector-effect="non-scaling-size"
            data-row={rowIndex}
            data-column={columnIndex}
          />
        {/if}
      {/each}
    {/each}
  {/if}

  {#if detectPenToolHits}
    <!-- Corners, borders, and cell centers -->
    {#each arrayfrom0ToN(dimensions.rows + 1) as rowIndex}
      {#each arrayfrom0ToN(dimensions.columns + 1) as columnIndex}
        {@const cell = { row: rowIndex, column: columnIndex }}
        <!-- Corners -->
        <rect
          on:mousedown={() => onMouseDownHitbox?.('corner', cell)}
          on:mouseenter={() => mouseDown && onMouseEnterHitbox?.('corner', cell)}
          x={CELL_SIZE * columnIndex - BORDER_WIDTH / 2}
          y={CELL_SIZE * rowIndex - BORDER_WIDTH / 2}
          width={BORDER_WIDTH}
          height={BORDER_WIDTH}
          vector-effect="non-scaling-size"
          class="fill-current cursor-pointer text-transparent hover:text-opacity-40"
          id="interface-corner"
        />

        <!-- Cell centers -->
        <rect
          on:mousedown={() =>
            onMouseDownHitbox?.('center', { row: rowIndex + 0.5, column: columnIndex + 0.5 })}
          on:mouseenter={() =>
            mouseDown &&
            onMouseEnterHitbox?.('center', { row: rowIndex + 0.5, column: columnIndex + 0.5 })}
          x={CELL_SIZE * columnIndex + BORDER_WIDTH / 2}
          y={CELL_SIZE * rowIndex + BORDER_WIDTH / 2}
          width={CELL_CENTER_WIDTH}
          height={CELL_CENTER_WIDTH}
          vector-effect="non-scaling-size"
          class="fill-current cursor-pointer text-transparent hover:text-opacity-40"
          id="interface-center"
        />

        <!-- Vertical border -->
        <rect
          on:mousedown={() =>
            onMouseDownHitbox?.('border', { row: rowIndex + 0.5, column: columnIndex })}
          on:mouseenter={() =>
            mouseDown &&
            onMouseEnterHitbox?.('border', { row: rowIndex + 0.5, column: columnIndex })}
          x={CELL_SIZE * columnIndex - BORDER_WIDTH / 2}
          y={CELL_SIZE * rowIndex + BORDER_WIDTH / 2}
          width={BORDER_WIDTH}
          height={CELL_CENTER_WIDTH}
          vector-effect="non-scaling-size"
          class="fill-current cursor-pointer text-transparent hover:text-opacity-40"
          id="interface-border"
        />

        <!-- Horizontal border -->
        <rect
          on:mousedown={() =>
            onMouseDownHitbox?.('border', { row: rowIndex, column: columnIndex + 0.5 })}
          on:mouseenter={() =>
            mouseDown &&
            onMouseEnterHitbox?.('border', { row: rowIndex, column: columnIndex + 0.5 })}
          x={CELL_SIZE * columnIndex + BORDER_WIDTH / 2}
          y={CELL_SIZE * rowIndex - BORDER_WIDTH / 2}
          width={CELL_CENTER_WIDTH}
          height={BORDER_WIDTH}
          vector-effect="non-scaling-size"
          class="fill-current cursor-pointer text-transparent hover:text-opacity-40"
          id="interface-border"
        />
      {/each}
    {/each}
  {/if}
</g>
