<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Givens, CellModifiers } from '$models/Sudoku';
	import type { Cornermarks, GameValues } from '$models/Walkthrough';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';

	export let dimensions: Dimensions;
	export let cornermarks: Cornermarks | undefined;
	export let givens: Givens;
	export let values: GameValues | undefined;
	export let modifiers: CellModifiers | undefined;
</script>

<g id="cornermarks" class="pointer-events-none">
	{#each arrayfrom0ToN(dimensions.rows) as row}
		{#each arrayfrom0ToN(dimensions.columns) as column}
			{@const cornermark = cornermarks?.[row]?.[column]}
			{#if cornermark && cornermark.length > 0 && !givens[row][column]}
				{@const value = values?.[row]?.[column] ?? ''}
				{@const sCell = modifiers?.some(
					(m) => m.type === 'SCell' && m.position.row === row && m.position.column === column
				)}
				{#if value.length === 0}
					{#each cornermark.split('') as cornerMark, i}
						<text
							x={cellSize * (column + 0.18 + 0.3 * (i % 3))}
							y={cellSize * (row + 0.22 + 0.3 * Math.floor(i / 3))}
							dominant-baseline="middle"
							class="fill-current text-blue-700 select-none"
						>
							{cornerMark}
						</text>
					{/each}
				{:else if sCell && !value.includes('/')}
					{#each cornermark.split('') as cornerMark, i}
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

<style>
	text {
		font-size: 1rem;
		text-anchor: middle;
	}

	.small {
		font-size: 0.75rem;
	}
</style>
