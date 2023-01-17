<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Givens, CellModifiers } from '$models/Sudoku';
	import type { Centermarks, GameValues } from '$models/Walkthrough';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';

	export let dimensions: Dimensions;
	export let centermarks: Centermarks | undefined;
	export let givens: Givens;
	export let values: GameValues | undefined;
	export let modifiers: CellModifiers | undefined;
</script>

<g id="centermarks" class="pointer-events-none">
	{#each arrayfrom0ToN(dimensions.rows) as row}
		{#each arrayfrom0ToN(dimensions.columns) as column}
			{@const centermark = centermarks?.[row]?.[column]}
			{#if centermark && centermark.length > 0 && !givens[row][column]}
				{@const value = values?.[row]?.[column] ?? ''}
				{@const sCell = modifiers?.some(
					(m) => m.type === 'SCell' && m.position.row === row && m.position.column === column
				)}
				{#if value.length === 0}
					<text
						x={cellSize * (column + 0.5)}
						y={cellSize * (row + 0.55)}
						dominant-baseline="middle"
						class:small={centermark.length > 6}
						class="fill-current text-blue-700 select-none"
					>
						{centermark}
					</text>
				{:else if sCell && !value.includes('/')}
					<text
						x={cellSize * (column + 0.75)}
						y={cellSize * (row + 0.85)}
						dominant-baseline="middle"
						class:small={centermark.length <= 6}
						class:x-small={centermark.length > 6}
						class="fill-current text-blue-700 select-none"
					>
						{centermark}
					</text>
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

	.x-small {
		font-size: 0.5rem;
	}
</style>
