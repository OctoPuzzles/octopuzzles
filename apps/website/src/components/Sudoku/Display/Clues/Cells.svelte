<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Cells } from '@octopuzzles/models';

  export let cells: Cells;
</script>

{#if cells}
  <g id="cells" class="select-none pointer-events-none">
    <defs>
      <rect
        id="cell"
        x={0}
        y={0}
        width={CELL_SIZE}
        height={CELL_SIZE}
        stroke="black"
        fill="none"
        stroke-width="0.5"
        vector-effect="non-scaling-size"
      />
    </defs>
    {#each cells as row, rowIndex}
      {#each row as cell, columnIndex}
        {#if cell}
          <use href="#cell" x={CELL_SIZE * columnIndex} y={CELL_SIZE * rowIndex} />
        {/if}
      {/each}
    {/each}
  </g>
{/if}
