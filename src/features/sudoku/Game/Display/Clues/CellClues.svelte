<script lang="ts">
	import { cellSize, symbolsMap } from '$constants';
	import classNames from 'classnames';
	import { getCellCluesToDraw } from '$utils/prefabs';
	import { cellCluesFontSize } from '$utils/cellCluesFontSize';
	import type { CellClueLocation, Cellclues } from '$models/Sudoku';

	export let cellClues: Cellclues;

	const horizontalOffset = (l?: CellClueLocation | null) => {
		switch (l) {
			case 'Top':
			case 'Center':
			case 'Bottom':
				return 0.5;
			case 'TopRight':
			case 'Right':
			case 'BottomRight':
				return 0.8;
			case 'TopLeft':
			case 'Left':
			case 'BottomLeft':
			default:
				return 0.2;
		}
	};

	const verticalOffset = (l?: CellClueLocation | null) => {
		switch (l) {
			case 'Left':
			case 'Center':
			case 'Right':
				return 0.5;
			case 'BottomLeft':
			case 'Bottom':
			case 'BottomRight':
				return 0.8;
			case 'TopLeft':
			case 'Top':
			case 'TopRight':
			default:
				return 0.2;
		}
	};
</script>

{#if cellClues.length > 0}
	<g id="cellclues">
		{#each cellClues as editorClue}
			{#each getCellCluesToDraw(editorClue) as cellClue}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<g class="select-none pointer-events-none">
					{#if cellClue.text && cellClue.text.length > 0}
						<text
							x={cellSize * (cellClue.position.column + horizontalOffset(cellClue.location))}
							y={cellSize * (cellClue.position.row + verticalOffset(cellClue.location))}
							dominant-baseline="middle"
							class={classNames(
								'fill-current text-4xl textanchor-middle',
								`text-${cellClue.color?.toLowerCase()}`
							)}
							style="font-size: {cellCluesFontSize(cellClue.text, cellClue.size)};"
						>
							{cellClue.text}
						</text>
					{/if}
					{#if cellClue.symbol && cellClue.color}
						<svelte:component
							this={symbolsMap[cellClue.symbol]}
							x={cellClue.position.column * cellSize}
							y={cellClue.position.row * cellSize}
							rotation={cellClue.rotation}
							color={cellClue.color}
						/>
					{/if}
				</g>
			{/each}
		{/each}
	</g>
{/if}

<style>
	text {
		text-anchor: middle;
		font-weight: 600;
	}
</style>
