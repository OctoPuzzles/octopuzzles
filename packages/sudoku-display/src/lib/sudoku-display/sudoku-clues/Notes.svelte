<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Position, Annotations } from '@octopuzzles/models';

  export let notes: Annotations | undefined;
  export let onClickNote: ((note: string, position: Position) => void) | undefined = undefined;

  function createPolygonPoints(row: number, column: number): string {
    const firstPoint = `${CELL_SIZE * column + 0.8 * CELL_SIZE},${CELL_SIZE * row}`;
    const secondPoint = `${CELL_SIZE * (column + 1)},${CELL_SIZE * row}`;
    const thirdPoint = `${CELL_SIZE * (column + 1)},${CELL_SIZE * row + 0.2 * CELL_SIZE}`;

    return `${firstPoint} ${secondPoint} ${thirdPoint}`;
  }
</script>

{#if notes}
  <g id="notes">
    {#each notes as note}
      {#if note.details}
        {#each note.positions as position}
          <polygon
            points={createPolygonPoints(position.row, position.column)}
            class="fill-current stroke-black-500 text-orange-300 cursor-pointer hover:text-orange-400 transition-colors"
            style="stroke-width:0.5;"
            on:click={() => onClickNote?.(note.details ?? '', position)}
            on:keypress={() => {
              /*Do nothing*/
            }}
          >
            <title>{note.details}</title>
          </polygon>
        {/each}
      {/if}
    {/each}
  </g>
{/if}
