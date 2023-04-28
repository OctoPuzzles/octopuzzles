<script lang="ts">
  import { CELL_SIZE, type Annotation, type Position } from '@octopuzzles/models';
  import classNames from 'classnames';

  export let pentool: Annotation;

  const CROSS_SIZE = 0.25;

  function createLine(positions: Position[]): string {
    let d = '';
    positions.forEach((cell, i) => {
      const letter = i === 0 ? 'M' : 'L';
      d += `${letter}${cell.column * CELL_SIZE} ${cell.row * CELL_SIZE} `;
    });

    return d;
  }
</script>

{#if pentool.positions.length === 1}
  {@const { row: y, column: x } = pentool.positions[0]}
  {@const isCenter = Math.round(x) !== x && Math.round(y) !== y}
  {@const scale = isCenter ? 1 : 0.5}
  {#if pentool.type === 'Pencircle'}
    <circle
      cx={x * CELL_SIZE}
      cy={y * CELL_SIZE}
      r={20 * scale}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4 * scale}
      class={classNames(
        `fill-none`,
        pentool.color != null
          ? `stroke-current text-${pentool.color.toLowerCase()}`
          : 'stroke-current text-white-500'
      )}
    />
  {:else if pentool.type === 'Pencross'}
    <line
      x1={(x - CROSS_SIZE * scale) * CELL_SIZE}
      y1={(y - CROSS_SIZE * scale) * CELL_SIZE}
      x2={(x + CROSS_SIZE * scale) * CELL_SIZE}
      y2={(y + CROSS_SIZE * scale) * CELL_SIZE}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4 * scale}
      class={classNames(
        `fill-none`,
        pentool.color != null
          ? `stroke-current text-${pentool.color.toLowerCase()}`
          : 'stroke-current text-white-500'
      )}
    />
    <line
      x1={(x - CROSS_SIZE * scale) * CELL_SIZE}
      y1={(y + CROSS_SIZE * scale) * CELL_SIZE}
      x2={(x + CROSS_SIZE * scale) * CELL_SIZE}
      y2={(y - CROSS_SIZE * scale) * CELL_SIZE}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4 * scale}
      class={classNames(
        `fill-none`,
        pentool.color != null
          ? `stroke-current text-${pentool.color.toLowerCase()}`
          : 'stroke-current text-white-500'
      )}
    />
  {:else}
    <circle
      cx={x * CELL_SIZE}
      cy={y * CELL_SIZE}
      r={2}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4 * scale}
      class={classNames(
        `fill-none`,
        pentool.color != null
          ? `stroke-current text-${pentool.color.toLowerCase()}`
          : 'stroke-current text-white-500'
      )}
    />
  {/if}
{:else}
  <path
    d={createLine(pentool.positions)}
    class={`stroke-current text-${pentool.color?.toLowerCase() ?? 'black'}`}
    stroke-width={6}
    stroke-linecap={'round'}
    stroke-linejoin={'round'}
    stroke-miterlimit="5"
    fill="none"
  />
{/if}
