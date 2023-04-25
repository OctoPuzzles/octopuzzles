<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Givens, CellValues } from '@octopuzzles/models';

  export let cellValues: CellValues | undefined;
  export let givens: Givens;

  function getPosition(n: number, i: number): number {
    let k = i;
    if (i >= 3) {
      if (n <= 6) {
        k += 3;
      } else if (i >= 4) {
        if (n === 7) {
          k += 2;
        } else {
          k += 1;
        }
      }
    }
    return k;
  }
</script>

{#if cellValues}
  <g id="cornermarks" class="pointer-events-none">
    {#each cellValues as cells, row}
      {#each cells as cell, column}
        {@const cornermarks = cell.cornermarks}
        {#if cornermarks !== undefined && givens[row][column] === '' && cell.digits === undefined}
          {@const n = cornermarks.length}
          {#each cornermarks as cornerMark, i}
            {#if i < 8}
              {@const k = getPosition(n, i)}
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
