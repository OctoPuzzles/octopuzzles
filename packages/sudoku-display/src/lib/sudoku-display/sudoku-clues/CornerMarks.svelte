<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Givens, CellValues } from '@octopuzzles/models';

  export let cellValues: CellValues | undefined;
  export let givens: Givens;
</script>

{#if cellValues}
  <g id="cornermarks" class="pointer-events-none">
    {#each cellValues as cells, row}
      {#each cells as cell, column}
        {@const cornermarks = cell.cornermarks}
        {#if cornermarks && !givens[row][column] && !cell.digits}
          {@const n = cornermarks.length}
          {#each cornermarks as cornerMark, i}
            {#if i < 8}
              {@const k = n <= 6 && i >= 3 ? i + 3 : n === 7 && i >= 4 ? i + 2 : i >= 4 ? i + 1 : i}
              <text
                x={CELL_SIZE * (column + 0.18 + 0.3 * (k % 3))}
                y={CELL_SIZE * (row + 0.22 + 0.3 * Math.floor(k / 3))}
                dominant-baseline="middle"
                class="fill-current text-blue-700 select-none"
              >
                {cornerMark}
              </text>
            {/if}
          {/each}
        {/if}
      {/each}
    {/each}
  </g>
{/if}

<style>
  text {
    font-size: 1rem;
    text-anchor: middle;
  }
</style>
