<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Givens } from '$models/Sudoku';
	import type { Cornermarks, GameValues } from '$models/Walkthrough';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';

	export let dimensions: Dimensions;
	export let cornermarks: Cornermarks | null;
	export let givens: Givens;
	export let values: GameValues | null;
</script>

<g id="cornermarks" class="pointer-events-none">
	{#each arrayfrom0ToN(dimensions.rows) as row}
		{#each arrayfrom0ToN(dimensions.columns) as column}
			{@const cornermark = cornermarks?.[row]?.[column]}
			{#if cornermark && cornermark.length > 0 && !givens[row][column] && !values?.[row]?.[column]}
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
			{/if}
		{/each}
	{/each}
</g>

<style>
	text {
		font-size: 1rem;
		text-anchor: middle;
	}
</style>
