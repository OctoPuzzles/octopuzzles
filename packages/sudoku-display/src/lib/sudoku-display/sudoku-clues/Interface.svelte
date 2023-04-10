<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type {
    Cells,
    Dimensions,
    Position,
    MouseDownHandler,
    MouseEnterHandler
  } from '@octopuzzles/models';
  import { defaultCells } from '@octopuzzles/sudoku-utils';
  import { isCommandKey } from '@octopuzzles/utils';

  export let cells: Cells;
  export let dimensions: Dimensions;
  export let isEditor = false;
  export let handleMouseDown: MouseDownHandler | undefined = undefined;
  export let handleMouseEnter: MouseEnterHandler | undefined = undefined;

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

  const realHandleMouseEnter = (position: Position, e: MouseEvent): void => {
    handleMouseEnter?.({ cell: position, metaButtonClicked: isCommandKey(e), mouseDown });
  };

  const realHandleMouseDown = (position: Position, e: MouseEvent): void => {
    handleMouseDown?.({ cell: position, metaButtonClicked: isCommandKey(e) });
  };
</script>

<svelte:body on:mousedown={() => (mouseDown = true)} on:mouseup={() => (mouseDown = false)} />

<g id="interface" on:touchmove|preventDefault>
  {#each cells as row, rowIndex}
    {#each row as cell, columnIndex}
      {#if cell}
        <rect
          on:mousedown={(e) => realHandleMouseDown({ row: rowIndex, column: columnIndex }, e)}
          on:mouseenter={(e) => realHandleMouseEnter({ row: rowIndex, column: columnIndex }, e)}
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
</g>
