<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Givens, CellValues } from '$models/Sudoku';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';

	export let dimensions: Dimensions;
	export let cellValues: CellValues | undefined;
	export let givens: Givens;
</script>

{#if cellValues}
	<g id="cornermarks" class="pointer-events-none">
		{#each arrayfrom0ToN(dimensions.rows) as row}
			{#each arrayfrom0ToN(dimensions.columns) as column}
				{@const cornermarks = cellValues[row][column].cornermarks}
				{#if cornermarks && !givens[row][column]}
					{@const digits = cellValues[row][column].digits}
					{@const sCell = cellValues[row][column].modifiers?.some((m) => m === 'SCell')}
					{#if !digits}
						{#each cornermarks as cornerMark, i}
							<text
								x={cellSize * (column + 0.18 + 0.3 * (i % 3))}
								y={cellSize * (row + 0.22 + 0.3 * Math.floor(i / 3))}
								dominant-baseline="middle"
								class="fill-current text-blue-700 select-none"
							>
								{cornerMark}
							</text>
						{/each}
					{:else if sCell && digits.length === 1}
						{#each cornermarks as cornerMark, i}
							<text
								x={cellSize * (column + 0.59 + 0.15 * (i % 3))}
								y={cellSize * (row + 0.61 + 0.15 * Math.floor(i / 3))}
								dominant-baseline="middle"
								class:small={true}
								class="fill-current text-blue-700 select-none"
							>
								{cornerMark}
							</text>
						{/each}
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
</style>
