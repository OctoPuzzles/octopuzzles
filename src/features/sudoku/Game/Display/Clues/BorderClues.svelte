<script lang="ts">
	import { cellSize, shapesToIcon } from '$constants';
	import classNames from 'classnames';
	import { borderCluesFontSize } from '$utils/borderCluesFontSize';
	import { getBorderCluesToDraw } from '$utils/prefabs';
	import type { Borderclue, Borderclues } from '$models/Sudoku';

	export let borderClues: Borderclues;

	function cy(bc: Borderclue): number {
		let maxRow = 0;
		let minRow = 1000;
		for (var position of bc.positions) {
			if (position.row > maxRow) {
				maxRow = position.row;
			}
			if (position.row < minRow) {
				minRow = position.row;
			}
		}
		return (maxRow + minRow) * 0.5;
	}

	function cx(bc: Borderclue): number {
		let maxCol = 0;
		let minCol = 1000;
		for (var position of bc.positions) {
			if (position.column > maxCol) {
				maxCol = position.column;
			}
			if (position.column < minCol) {
				minCol = position.column;
			}
		}
		return (maxCol + minCol) * 0.5;
	}

	function adjustedRadius(r: number): number {
		return (r / 100) * cellSize;
	}
</script>

{#if borderClues.length > 0}
	<g id="borderclues">
		{#each borderClues as editorClue, index}
			{#each getBorderCluesToDraw(editorClue) as borderClue}
				{@const values = borderClue.text?.split(',') ?? null}
				{@const radius = adjustedRadius(borderClue.radius ?? 10)}
				{@const fontSize = borderCluesFontSize(
					(values?.length ?? 0) > 1 ? '123' : borderClue.text ?? '',
					borderClue.radius ?? 10
				)}
				<g class="select-none pointer-events-none">
					{#if borderClue.shape === 'Line'}
						<line
							x1={(cx(borderClue) + 0.5) * cellSize -
								(borderClue.positions[0].row - borderClue.positions[1].row) * radius}
							y1={(cy(borderClue) + 0.5) * cellSize +
								(borderClue.positions[0].column - borderClue.positions[1].column) * radius}
							x2={(cx(borderClue) + 0.5) * cellSize +
								(borderClue.positions[0].row - borderClue.positions[1].row) * radius}
							y2={(cy(borderClue) + 0.5) * cellSize -
								(borderClue.positions[0].column - borderClue.positions[1].column) * radius}
							class="stroke-current stroke-3 text-{borderClue.color
								? borderClue.color.toLowerCase()
								: 'white'}"
							stroke-linecap="square"
						/>
					{:else}
						<svelte:component
							this={shapesToIcon[borderClue.shape ?? 'Circle']}
							x={(cx(borderClue) + 0.5) * cellSize - radius}
							y={(cy(borderClue) + 0.5) * cellSize - radius}
							color={borderClue.color ?? undefined}
							border={borderClue.color ? true : false}
							size={radius * 2}
							rotation="North"
						/>
					{/if}

					{#if values}
						{#each values as value, index}
							{@const xOffset =
								index % 2 === 1 || index < values.length - 1
									? 0.4 * radius * (2 * (index % 2) - 1)
									: 0}
							{@const yOffset =
								values.length > 2 ? 0.4 * radius * (2 * Math.floor(index / 2) - 1) : 0}
							<text
								class={classNames('fill-current', {
									'text-black': !['Black', 'Gray'].includes(borderClue.color ?? 'None'),
									'text-white': ['Black', 'Gray'].includes(borderClue.color ?? 'None')
								})}
								x={(cx(borderClue) + 0.5) * cellSize + xOffset}
								y={(cy(borderClue) + 0.52) * cellSize + yOffset}
								dominant-baseline="middle"
								style="font-size: {fontSize};"
							>
								{value}
							</text>
						{/each}
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
