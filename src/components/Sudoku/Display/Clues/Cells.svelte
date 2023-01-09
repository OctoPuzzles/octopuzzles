<script lang="ts">
	import { cellSize } from '$constants';
	import type { Cells } from '$models/Sudoku';

	export let cells: Cells;
</script>

{#if cells}
	<g id="cells" class="select-none pointer-events-none">
		{#each cells as row, rowIndex}
			{#each row as cell, columnIndex}
				{#if cell}
					<rect
						class="w-cell h-cell stroke-black fill-none stroke-0.5"
						x={cellSize * columnIndex}
						y={cellSize * rowIndex}
						vector-effect="non-scaling-size"
					/>
				{/if}
			{/each}
		{/each}
	</g>
{/if}
