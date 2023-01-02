<script lang="ts">
	import { cellSize } from '$constants';
	import type { Notes } from '$models/Walkthrough';
	import { highlights } from '$stores/sudokuStore';

	export let notes: Notes;

	function createPolygonPoints(row: number, column: number): string {
		let firstPoint = `${cellSize * column + 0.8 * cellSize},${cellSize * row}`;
		let secondPoint = `${cellSize * (column + 1)},${cellSize * row}`;
		let thirdPoint = `${cellSize * (column + 1)},${cellSize * row + 0.2 * cellSize}`;

		return `${firstPoint} ${secondPoint} ${thirdPoint}`;
	}

	function onClick(row: number, column: number) {
		highlights.set({ inputMode: 'notes', selectedCells: [{ row, column }] });
	}
</script>

<g id="notes">
	{#each notes as row, rowIndex}
		{#each row as note, columnIndex}
			{#if note.length > 0}
				<polygon
					points={createPolygonPoints(rowIndex, columnIndex)}
					class="fill-current stroke-black-500 text-orange-300 cursor-pointer hover:text-orange-400 transition-colors"
					style="stroke-width:0.5;"
					on:click={() => onClick(rowIndex, columnIndex)}
					on:keypress={() => onClick(rowIndex, columnIndex)}
				>
					<title>{note}</title>
				</polygon>
			{/if}
		{/each}
	{/each}
</g>
