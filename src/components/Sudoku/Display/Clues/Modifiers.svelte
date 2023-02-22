<script lang="ts">
	import { cellSize } from '$constants';
	import type { CellValues, Dimensions } from '$models/Sudoku';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';

	export let dimensions: Dimensions;
	export let cellValues: CellValues | undefined;
</script>

{#if cellValues}
	<g id="modifiers">
		{#each arrayfrom0ToN(dimensions.rows) as row}
			{#each arrayfrom0ToN(dimensions.columns) as column}
				{@const modifiers = cellValues[row][column].modifiers}
				{#if modifiers}
					{#each modifiers as modifier}
						<g class="pointer-events-none">
							{#if modifier === 'SCell'}
								<line
									x1={cellSize * (column + 0.1)}
									y1={cellSize * (row + 0.9)}
									x2={cellSize * (column + 0.9)}
									y2={cellSize * (row + 0.1)}
									class={`stroke-current stroke-5 cursor text-gray`}
									stroke-linecap="round"
								/>
							{:else if modifier === 'Doubler'}
								<text
									x={cellSize * (column + 0.88)}
									y={cellSize * (row + 0.92)}
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
