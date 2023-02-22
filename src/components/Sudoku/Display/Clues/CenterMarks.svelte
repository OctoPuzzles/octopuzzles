<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Givens, CellValues } from '$models/Sudoku';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';

	export let dimensions: Dimensions;
	export let cellValues: CellValues | undefined;
	export let givens: Givens;
</script>

{#if cellValues}
	<g id="centermarks" class="pointer-events-none">
		{#each arrayfrom0ToN(dimensions.rows) as row}
			{#each arrayfrom0ToN(dimensions.columns) as column}
				{@const centermarks = cellValues[row][column].centermarks}
				{#if centermarks && !givens[row][column]}
					{@const digits = cellValues[row][column].digits}
					{@const sCell = cellValues[row][column].modifiers?.some((m) => m === 'SCell')}
					{#if !digits}
						<text
							x={cellSize * (column + 0.5)}
							y={cellSize * (row + 0.55)}
							dominant-baseline="middle"
							class:small={centermarks.length > 6}
							class="fill-current text-blue-700 select-none"
						>
							{centermarks.join('')}
						</text>
					{:else if sCell && digits.length === 1}
						<text
							x={cellSize * (column + 0.75)}
							y={cellSize * (row + 0.85)}
							dominant-baseline="middle"
							class:small={centermarks.length <= 6}
							class:x-small={centermarks.length > 6}
							class="fill-current text-blue-700 select-none"
						>
							{centermarks.join('')}
						</text>
					{/if}
				{/if}
			{/each}
		{/each}
	</g>
{/if}

<style>
	text {
		font-size: 1rem;
		text-anchor: middle;
	}

	.small {
		font-size: 0.75rem;
	}

	.x-small {
		font-size: 0.5rem;
	}
</style>
