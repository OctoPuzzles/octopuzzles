<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { CellValues } from '@octopuzzles/models';

  export let cellValues: CellValues | undefined;
</script>

{#if cellValues}
  <g id="modifiers">
    {#each cellValues as cells, row}
      {#each cells as cell, column}
        {@const modifiers = cell.modifiers}
        {#if modifiers}
          {#each modifiers as modifier}
            <g class="pointer-events-none">
              {#if modifier === 'SCell'}
                <line
                  x1={CELL_SIZE * (column + 0.1)}
                  y1={CELL_SIZE * (row + 0.9)}
                  x2={CELL_SIZE * (column + 0.9)}
                  y2={CELL_SIZE * (row + 0.1)}
                  class={`stroke-current stroke-5 cursor text-gray`}
                  stroke-linecap="round"
                />
              {:else if modifier === 'Doubler'}
                <text
                  x={CELL_SIZE * (column + 0.88)}
                  y={CELL_SIZE * (row + 0.92)}
                  dominant-baseline="middle"
                  class="fill-current text-blue-700 select-none"
                >
                  x2
                </text>
              {/if}
            </g>
          {/each}
        {/if}
      {/each}
    {/each}
  </g>
{/if}

<style>
  text {
    font-size: 0.5rem;
    text-anchor: middle;
  }
</style>
