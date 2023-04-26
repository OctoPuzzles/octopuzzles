<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Givens, CellValues } from '@octopuzzles/models';

  export let cellValues: CellValues | undefined;
  export let givens: Givens;
</script>

{#if cellValues}
  <g id="centermarks" class="pointer-events-none">
    {#each cellValues as cells, row}
      {#each cells as cell, column}
        {@const centermarks = cell.centermarks}
        {#if centermarks && !givens[row][column]}
          {@const digits = cell.digits}
          {@const sCell = cell.modifiers?.some((m) => m === 'SCell')}
          {#if !digits}
            <text
              x={CELL_SIZE * (column + 0.5)}
              y={CELL_SIZE * (row + 0.55)}
              dominant-baseline="middle"
              class:small={centermarks.length > 6}
              class="fill-current text-blue-700 select-none"
            >
              {centermarks.join('')}
            </text>
          {:else if sCell && digits.length === 1}
            <text
              x={CELL_SIZE * (column + 0.75)}
              y={CELL_SIZE * (row + 0.85)}
              dominant-baseline="middle"
              class:small={centermarks.length <= 6}
              class:x-small={centermarks.length > 6}
              class="fill-current text-blue-700 select-none"
            >
              {centermarks.join('')}
            </text>
          {/if}
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

  .small {
    font-size: 0.75rem;
  }
</style>
