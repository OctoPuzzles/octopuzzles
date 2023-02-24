<script lang="ts">
	import { cellSize } from '$constants';
	import type { Cells } from '$models/Sudoku';

	export let cells: Cells;
</script>

{#if cells}
	<g id="cells" class="select-none pointer-events-none">
		<defs>
			<rect
				id="cell"
				x={0}
				y={0}
				width={cellSize}
				height={cellSize}
				stroke="black"
				fill="none"
				stroke-width="0.5"
				vector-effect="non-scaling-size"
			/>
		</defs>
		{#each cells as row, rowIndex}
			{#each row as cell, columnIndex}
				{#if cell}
					<use href="#cell" x={cellSize * columnIndex} y={cellSize * rowIndex} />
				{/if}
			{/each}
		{/each}
	</g>
{/if}
