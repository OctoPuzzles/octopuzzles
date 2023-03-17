<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Position, Notes } from '@octopuzzles/models';

  export let notes: Notes | undefined;
  export let onClickNote: ((note: string, position: Position) => void) | undefined = undefined;

  function createPolygonPoints(row: number, column: number): string {
    let firstPoint = `${CELL_SIZE * column + 0.8 * CELL_SIZE},${CELL_SIZE * row}`;
    let secondPoint = `${CELL_SIZE * (column + 1)},${CELL_SIZE * row}`;
    let thirdPoint = `${CELL_SIZE * (column + 1)},${CELL_SIZE * row + 0.2 * CELL_SIZE}`;

    return `${firstPoint} ${secondPoint} ${thirdPoint}`;
  }
</script>

{#if notes}
  <g id="notes">
    {#each notes as row, rowIndex}
      {#each row as note, columnIndex}
        {#if note.length > 0}
          <polygon
            points={createPolygonPoints(rowIndex, columnIndex)}
            class="fill-current stroke-black-500 text-orange-300 cursor-pointer hover:text-orange-400 transition-colors"
            style="stroke-width:0.5;"
            on:click={() => onClickNote?.(note, { row: rowIndex, column: columnIndex })}
            on:keypress={() => {
              /*Do nothing*/
            }}
          >
            <title>{note}</title>
          </polygon>
        {/if}
      {/each}
    {/each}
  </g>
{/if}
