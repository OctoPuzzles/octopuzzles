<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import classNames from 'classnames';
  import { topLeftPosition, createOutlines } from '@octopuzzles/sudoku-utils';
  import type { Dimensions, Extendedcage } from '@octopuzzles/models';

  export let cage: Extendedcage;
  export let dimensions: Dimensions;

  $: topLeft = topLeftPosition(cage.positions);
  $: outlines = createOutlines(cage.positions, dimensions, 4);
</script>

{#each outlines as outline}
  <polyline
    points={outline}
    class={classNames(
      'stroke-current fill-none',
      cage.color != null && `text-${cage.color?.toLowerCase()}`
    )}
  />
{/each}
{#if cage.text != null && cage.text.length > 0}
  <text
    class={classNames('stroke-current', cage.color != null && `text-${cage.color?.toLowerCase()}`)}
    x={CELL_SIZE * topLeft.column + 2}
    y={CELL_SIZE * topLeft.row + 2}
    width={CELL_SIZE}
    height={CELL_SIZE}
    filter="url(#solid)"
    dominant-baseline="hanging">{cage.text}</text
  >
{/if}

<style>
  polyline {
    stroke-dasharray: 3 5;
    stroke-width: 1.5px;
    stroke-linecap: square;
  }
  text {
    font-size: 0.75rem;
  }
</style>
