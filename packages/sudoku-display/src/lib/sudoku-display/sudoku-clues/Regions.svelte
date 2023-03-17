<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Dimensions, Regions } from '@octopuzzles/models';
  import { createOutlines, getRegionsToDraw } from '@octopuzzles/sudoku-utils';

  export let regions: Regions;

  export let dimensions: Dimensions;
</script>

{#if regions.length > 0}
  <g id="regions" class="select-none pointer-events-none">
    {#each regions as editorRegion}
      {#each getRegionsToDraw(editorRegion) as region}
        {#if region.color != null}
          {#each region.positions as position}
            <rect
              x={CELL_SIZE * position.column}
              y={CELL_SIZE * position.row}
              width={CELL_SIZE}
              height={CELL_SIZE}
              class="fill-current text-{region.color.toLowerCase()} opacity-60"
              vector-effect="non-scaling-size"
            />
          {/each}
        {/if}
        {#if region.borders}
          {#each createOutlines(region.positions, dimensions) as outline}
            <polyline
              class="stroke-black linecap-square fill-none"
              points={outline}
              stroke-width={3}
            />
          {/each}
        {/if}
      {/each}
    {/each}
  </g>
{/if}
