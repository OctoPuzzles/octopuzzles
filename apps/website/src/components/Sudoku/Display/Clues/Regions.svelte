<script lang="ts">
  import { cellSize } from '$constants';
  import type { Dimensions, Regions } from '$models/Sudoku';
  import { createOutlines } from '$utils/createEdges';
  import { getRegionsToDraw } from '$utils/prefabs';

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
              x={cellSize * position.column}
              y={cellSize * position.row}
              class="fill-current text-{region.color.toLowerCase()} w-cell h-cell opacity-60"
              vector-effect="non-scaling-size"
            />
          {/each}
        {/if}
        {#if region.borders}
          {#each createOutlines(region.positions, dimensions) as outline}
            <polyline class="stroke-black stroke-3 linecap-square fill-none" points={outline} />
          {/each}
        {/if}
      {/each}
    {/each}
  </g>
{/if}
