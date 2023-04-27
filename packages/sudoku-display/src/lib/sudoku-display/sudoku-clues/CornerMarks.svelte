<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Givens, CellValues } from '@octopuzzles/models';

  export let cellValues: CellValues | undefined;
  export let givens: Givens;

  function getSubposition(numDigits: number, index: number): number {
    let subPosition = index;
    if (index >= 3) {
      if (numDigits <= 6) {
        subPosition += 3;
      } else if (index >= 4) {
        if (numDigits === 7) {
          subPosition += 2;
        } else {
          subPosition += 1;
        }
      }
    }
    return subPosition;
  }
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
              {@const subposition = getSubposition(numDigits, i)}
              <text
                x={CELL_SIZE * (column + 0.18 + 0.3 * (subposition % 3))}
                y={CELL_SIZE * (row + 0.22 + 0.3 * Math.floor(subposition / 3))}
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
