<script lang="ts">
	import { cellSize } from '$constants';
	import type { Position, Annotations } from '$models/Sudoku';

	export let annotations: Annotations | undefined;
	export let onClickNote: ((note: string, position: Position) => void) | undefined = undefined;

	function createPolygonPoints(row: number, column: number): string {
		let firstPoint = `${cellSize * column + 0.8 * cellSize},${cellSize * row}`;
		let secondPoint = `${cellSize * (column + 1)},${cellSize * row}`;
		let thirdPoint = `${cellSize * (column + 1)},${cellSize * row + 0.2 * cellSize}`;

		return `${firstPoint} ${secondPoint} ${thirdPoint}`;
	}
</script>

{#if annotations}
	{@const notes = annotations.filter((n) => n.type === 'Note')}
	<g id="notes">
		{#each notes as note}
			{#if note.details}
				{#each note.positions as position}
					<polygon
						points={createPolygonPoints(position.row, position.column)}
						class="fill-current stroke-black-500 text-orange-300 cursor-pointer hover:text-orange-400 transition-colors"
						style="stroke-width:0.5;"
						on:click={() => onClickNote?.(note.details ?? '', position)}
						on:keypress={() => {
							/*Do nothing*/
						}}
					>
						<title>{note.details}</title>
					</polygon>
				{/each}
			{/if}
		{/each}
	</g>
{/if}
