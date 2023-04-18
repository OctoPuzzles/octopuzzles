<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Dimensions, Givens, Cornermarks, GameValues } from '@octopuzzles/models';
  import { arrayfrom0ToN } from '@octopuzzles/utils';

  export let dimensions: Dimensions;
  export let cornermarks: Cornermarks | undefined;
  export let givens: Givens;
  export let values: GameValues | undefined;
</script>

<g id="cornermarks" class="pointer-events-none">
  {#each arrayfrom0ToN(dimensions.rows) as row}
    {#each arrayfrom0ToN(dimensions.columns) as column}
      {@const cornermark = cornermarks?.[row]?.[column]}
      {#if cornermark && cornermark.length > 0 && !givens[row][column] && values?.[row]?.[column] == null}
        {#each cornermark.split('') as cornerMark, i}
          <text
            x={CELL_SIZE * (column + 0.18 + 0.3 * (i % 3))}
            y={CELL_SIZE * (row + 0.22 + 0.3 * Math.floor(i / 3))}
            dominant-baseline="middle"
            class="fill-current text-blue-700 select-none"
          >
            {cornerMark}
          </text>
        {/each}
      {/if}
    {/each}
  {/each}
</g>

<style>
  text {
    font-size: 1rem;
    text-anchor: middle;
  }
</style>
