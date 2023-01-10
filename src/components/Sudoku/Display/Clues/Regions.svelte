<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Regions } from '$models/Sudoku';
	import { createEdges } from '$utils/createEdges';
	import { getRegionsToDraw } from '$utils/constraints/regions';

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
					{#each createEdges(region.positions, dimensions) as edge}
						<line
							class="stroke-black stroke-3 linecap-square"
							x1={edge.x1 * cellSize}
							y1={edge.y1 * cellSize}
							x2={edge.x2 * cellSize}
							y2={edge.y2 * cellSize}
						/>
					{/each}
				{/if}
			{/each}
		{/each}
	</g>
{/if}
