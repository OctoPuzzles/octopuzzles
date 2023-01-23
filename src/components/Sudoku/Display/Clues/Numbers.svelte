<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Givens, GameData } from '$models/Sudoku';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';
	import classNames from 'classnames';

	export let givens: Givens;
	export let gameData: GameData | undefined;
	export let dimensions: Dimensions;
</script>

<g id="numbers" class="select-none pointer-events-none">
	{#each arrayfrom0ToN(dimensions.rows) as row}
		{#each arrayfrom0ToN(dimensions.columns) as column}
			{@const isGiven = !!givens[row][column]}
			{@const digits = isGiven ? [givens[row][column]] : gameData?.cellValues[row][column].digits}
			{#if digits}
				{@const sCell = gameData?.cellValues[row][column].modifiers?.some((m) => m === 'SCell')}
				<text
					x={cellSize * (column + (sCell ? 0.25 : 0.5))}
					y={cellSize * (row + (sCell ? 0.3 : 0.55))}
					dominant-baseline="middle"
					class={classNames(
						'fill-current text-4xl textanchor-middle',
						{ 'text-black': isGiven },
						{ 'text-blue-700': !isGiven }
					)}
					style="font-size: {sCell ? '1.7rem' : '2.4rem'};"
				>
					{digits[0]}
				</text>
				{#if sCell && digits.length > 1}
					<text
						x={cellSize * (column + 0.75)}
						y={cellSize * (row + 0.8)}
						dominant-baseline="middle"
						class={classNames(
							'fill-current text-4xl textanchor-middle',
							{ 'text-black': isGiven },
							{ 'text-blue-700': !isGiven }
						)}
						style="font-size: {sCell ? '1.7rem' : '2.4rem'};"
					>
						{digits[1]}
					</text>
				{/if}
			{/if}
		{/each}
	{/each}
</g>
