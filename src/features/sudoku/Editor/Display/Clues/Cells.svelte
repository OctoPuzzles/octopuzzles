<script lang="ts">
	import Cell from '$features/sudoku/components/display/cells/Cell.svelte';
	import type { Cells } from '$models/Sudoku';

	export let cells: Cells;
</script>

{#if cells}
	<g id="cells" class="select-none pointer-events-none">
		{#each cells as row, rowIndex}
			{#each row as cell, columnIndex}
				{#if cell}
					<Cell row={rowIndex} column={columnIndex} />
				{/if}
			{/each}
		{/each}
	</g>
{/if}
