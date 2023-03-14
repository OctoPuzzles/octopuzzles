<script lang="ts">
  import { cellSize } from '$constants';
  import classNames from 'classnames';
  import { topLeftOfPositions } from '$utils/topLeftOfPositions';
  import { createOutlines } from '$utils/createEdges';
  import type { Dimensions, Extendedcage } from '@octopuzzles/models';

  export let cage: Extendedcage;
  export let dimensions: Dimensions;

  $: topLeft = topLeftOfPositions(cage.positions);
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
{#if cage.text && cage.text.length > 0}
  <text
    class={classNames('stroke-current', cage.color != null && `text-${cage.color?.toLowerCase()}`)}
    x={cellSize * topLeft.column + 2}
    y={cellSize * topLeft.row + 2}
    width={cellSize}
    height={cellSize}
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
