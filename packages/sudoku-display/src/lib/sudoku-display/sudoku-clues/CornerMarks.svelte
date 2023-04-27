<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Givens, CellValues } from '@octopuzzles/models';

  export let cellValues: CellValues | undefined;
  export let givens: Givens;

  const subPositions = [
    [0],
    [0, 2],
    [0, 2, 6],
    [0, 2, 6, 8],
    [0, 1, 2, 6, 8],
    [0, 1, 2, 6, 7, 8],
    [0, 1, 2, 3, 6, 7, 8],
    [0, 1, 2, 3, 5, 6, 7, 8]
  ];
</script>

{#if cellValues}
  <g id="cornermarks" class="pointer-events-none">
    {#each cellValues as cells, row}
      {#each cells as cell, column}
        {@const cornermarks = cell.cornermarks}
        {#if cornermarks !== undefined && givens[row][column] === '' && cell.digits === undefined}
          {@const numDigits = cornermarks.length}
          {#each cornermarks as cornerMark, i}
            <!--If you're using all 9 digits as cornermarks then you're solving the puzzle wrong! Hide the overflow for clarity-->
            {#if i < 8}
              {@const subposition = subPositions[Math.min(cornermarks.length, 8) - 1][i]}
              <text
                x={CELL_SIZE * (column + 0.18 + 0.3 * (subposition % 3))}
                y={CELL_SIZE * (row + 0.22 + 0.3 * Math.floor(subposition / 3))}
                dominant-baseline="middle"
                class="fill-current text-blue-700 select-none"
              >
                {numDigits > 8 && i === 7 ? '...' : cornerMark}
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
