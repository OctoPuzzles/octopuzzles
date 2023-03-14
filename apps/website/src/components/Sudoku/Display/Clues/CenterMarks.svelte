<script lang="ts">
  import { cellSize } from '$constants';
  import type { Dimensions, Givens } from '@octopuzzles/models';
  import type { Centermarks, GameValues } from '@octopuzzles/models';
  import { arrayfrom0ToN } from '@octopuzzles/utils';

  export let dimensions: Dimensions;
  export let centermarks: Centermarks | undefined;
  export let givens: Givens;
  export let values: GameValues | undefined;
</script>

<g id="centermarks" class="pointer-events-none">
  {#each arrayfrom0ToN(dimensions.rows) as row}
    {#each arrayfrom0ToN(dimensions.columns) as column}
      {@const centermark = centermarks?.[row]?.[column]}
      {#if centermark && centermark.length > 0 && !givens[row][column] && !values?.[row]?.[column]}
        <text
          x={cellSize * (column + 0.5)}
          y={cellSize * (row + 0.55)}
          dominant-baseline="middle"
          class:small={centermark.length > 6}
          class="fill-current text-blue-700 select-none"
        >
          {centermark}
        </text>
      {/if}
    {/each}
  {/each}
</g>

<style>
  text {
    font-size: 1rem;
    text-anchor: middle;
  }

  .small {
    font-size: 0.75rem;
  }
</style>
