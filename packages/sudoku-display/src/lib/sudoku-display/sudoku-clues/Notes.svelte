<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Position, Annotations } from '@octopuzzles/models';
  import classNames from 'classnames';

  export let notes: Annotations | undefined;
  export let onClickNote: ((note: string, position: Position) => void) | undefined = undefined;

  function createPolygonPoints(row: number, column: number, index: number): string {
    const firstPoint = `${CELL_SIZE * column + 0.8 * CELL_SIZE - 2 * index},${
      CELL_SIZE * row + 2 * index
    }`;
    const secondPoint = `${CELL_SIZE * (column + 1) - 2 * index},${CELL_SIZE * row + 2 * index}`;
    const thirdPoint = `${CELL_SIZE * (column + 1) - 2 * index},${
      CELL_SIZE * row + 0.2 * CELL_SIZE + 2 * index
    }`;

    return `${firstPoint} ${secondPoint} ${thirdPoint}`;
  }
</script>

{#if notes}
  <g id="notes">
    {#each notes as note, index}
      {#if note.details}
        {#each note.positions as position}
          {@const color = note.color?.toLowerCase()}
          {@const zIndex = notes.filter(
            (n, i) =>
              i < index &&
              n.positions.find((p) => p.row === position.row && p.column === position.column)
          ).length}
          <polygon
            points={createPolygonPoints(position.row, position.column, zIndex)}
            class={classNames(
              'fill-current',
              'stroke-black-500',
              `text-${color ?? 'orange-300'}`,
              'cursor-pointer',
              `hover:text-${color ?? 'orange-400'}`,
              'transition-colors'
            )}
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
