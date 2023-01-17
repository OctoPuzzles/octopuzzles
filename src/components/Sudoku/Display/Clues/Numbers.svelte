<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Givens, CellModifiers } from '$models/Sudoku';
	import type { GameValues } from '$models/Walkthrough';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';
	import classNames from 'classnames';

	export let givens: Givens;
	export let values: GameValues | undefined;
	export let modifiers: CellModifiers | undefined;

	export let dimensions: Dimensions;

	const fontSize = (s: string): string => {
		switch (s.length) {
			case 1:
				return '2.4rem';
			case 2:
				return '1.7rem';
			case 3:
				return '1rem';
			default:
				return '2.4rem';
		}
	};
</script>

<g id="numbers" class="select-none pointer-events-none">
	{#each arrayfrom0ToN(dimensions.rows) as row}
		{#each arrayfrom0ToN(dimensions.columns) as column}
			{@const val = givens[row][column] || values?.[row]?.[column]}
			{#if val && val.length > 0}
				{@const sCell = modifiers?.some(
					(m) => m.type === 'SCell' && m.position.row === row && m.position.column === column
				)}
				{#if sCell}
					{@const vals = val.split('/')}
					<text
						x={cellSize * (column + 0.25)}
						y={cellSize * (row + 0.3)}
						dominant-baseline="middle"
						class={classNames(
							'fill-current text-4xl textanchor-middle',
							{ 'text-black': !!givens?.[row]?.[column] },
							{ 'text-blue-700': !givens?.[row]?.[column] }
						)}
						style="font-size: {fontSize(vals[0] + '_')};"
					>
						{vals[0]}
					</text>
					{#if vals.length > 1}
						<text
							x={cellSize * (column + 0.75)}
							y={cellSize * (row + 0.8)}
							dominant-baseline="middle"
							class={classNames(
								'fill-current text-4xl textanchor-middle',
								{ 'text-black': !!givens?.[row]?.[column] },
								{ 'text-blue-700': !givens?.[row]?.[column] }
							)}
							style="font-size: {fontSize(vals[1] + '_')};"
						>
							{vals[1]}
						</text>
					{/if}
				{:else}
					<text
						x={cellSize * (column + 0.5)}
						y={cellSize * (row + 0.55)}
						dominant-baseline="middle"
						class={classNames(
							'fill-current text-4xl textanchor-middle',
							{ 'text-black': !!givens?.[row]?.[column] },
							{ 'text-blue-700': !givens?.[row]?.[column] }
						)}
						style="font-size: {fontSize(val)};"
					>
						{val}
					</text>
				{/if}
			{/if}
		{/each}
	{/each}
</g>
