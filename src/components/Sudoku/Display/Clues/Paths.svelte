<script lang="ts">
	import { cellSize } from '$constants';
	import type { Paths, Position } from '$models/Sudoku';
	import { getPathsToDraw } from '$utils/prefabs';
	import classNames from 'classnames';

	export let paths: Paths;

	const MAX_WIDTH_FOR_ARROW = 20;

	function createPaths(positions: Position[]): string {
		let d = '';
		positions.forEach((cell, i) => {
			const letter = i === 0 ? 'M' : 'L';
			d += `${letter}${(cell.column + 0.5) * cellSize} ${(cell.row + 0.5) * cellSize} `;
		});

		return d;
	}

	function createArrow({ row, column }: Position): string {
		let d = `
			M${(column + 0.5) * cellSize + 10} ${(row + 0.5) * cellSize + 10}
			L${(column + 0.5) * cellSize} ${(row + 0.5) * cellSize}
			L${(column + 0.5) * cellSize + 10} ${(row + 0.5) * cellSize - 10}
		`;
		return d;
	}

	function rotate(positions: Position[], offset = 0, reverse = false): string | undefined {
		const first =
			positions.length > 1 ? positions[reverse ? 1 : positions.length - 2] : positions[0];
		const last = positions[reverse ? 0 : positions.length - 1];
		if (first == null || last == null) {
			return undefined;
		}

		let degrees: number;
		if (first.column === last.column) {
			degrees = 90 * Math.sign(first.row - last.row) + offset;
		} else {
			degrees =
				(Math.atan((first.row - last.row) / (first.column - last.column)) * 180) / Math.PI + offset;
			if (first.column < last.column) {
				degrees = degrees + 180;
			}
		}
		return `rotate(${degrees} ${(last.column + 0.5) * cellSize} ${(last.row + 0.5) * cellSize})`;
	}

	function getSize(width: number): number {
		return (cellSize * width) / 100;
	}
</script>

{#if paths.length > 0}
	<g id="paths" class="select-none pointer-events-none opacity-60">
		{#each paths as editorpath}
			{#each getPathsToDraw(editorpath) as path}
				{@const firstPosition = path.positions[0]}
				{@const lastPosition = path.positions[path.positions.length - 1]}
				{@const arrow =
					path.arrow &&
					path.positions.length > 1 &&
					lastPosition &&
					(path.width ?? 10) <= MAX_WIDTH_FOR_ARROW}
				{#each path.fill === 'Hollow' ? [1, 2] : [1] as step}
					{@const size =
						step === 2 ? Math.max(getSize(path.width ?? 10) - 3, 0) : getSize(path.width ?? 10)}
					{@const color = step === 2 ? 'white' : path.color ? path.color.toLowerCase() : 'black'}
					{#if firstPosition && (path.positions.length === 1 || path.form === 'Diamond' || (path.form === 'Square' && arrow))}
						{#if path.form === 'Square'}
							<rect
								height={size}
								width={size}
								x={cellSize * firstPosition.column + (cellSize - size) * 0.5}
								y={cellSize * firstPosition.row + (cellSize - size) * 0.5}
								dominant-baseline="middle"
								vector-effect="non-scaling-size"
								class={classNames(`stroke-current text-${color}`, 'fill-current')}
								transform={rotate(path.positions, 0, true)}
							/>
						{:else if path.form === 'Diamond'}
							<rect
								height={size * 0.707}
								width={size * 0.707}
								x={cellSize * firstPosition.column + (cellSize - size * 0.707) * 0.5}
								y={cellSize * firstPosition.row + (cellSize - size * 0.707) * 0.5}
								dominant-baseline="middle"
								vector-effect="non-scaling-size"
								class={classNames(`stroke-current text-${color}`, 'fill-current')}
								transform={rotate(path.positions, 45, true)}
							/>
						{:else}
							<circle
								cx={cellSize * (firstPosition.column + 0.5)}
								cy={cellSize * (firstPosition.row + 0.5)}
								r={size * 0.5}
								class={classNames(`stroke-current text-${color}`, 'fill-current')}
							/>
						{/if}
					{/if}
					{#if path.positions.length > 1}
						<path
							d={createPaths(path.positions)}
							class="stroke-current text-{color}"
							stroke-width={size + 1}
							stroke-linecap={path.form === 'Diamond' || (path.form === 'Square' && arrow)
								? 'butt'
								: path.form === 'Square'
								? 'square'
								: 'round'}
							stroke-linejoin={path.form !== 'Round' ? 'miter' : 'round'}
							stroke-miterlimit="5"
							fill="none"
						/>
						{#if arrow}
							<path
								d={createArrow(lastPosition)}
								class="stroke-current text-{color}"
								stroke-width={size + 1}
								stroke-linecap={path.form === 'Diamond'
									? 'butt'
									: path.form === 'Square'
									? 'square'
									: 'round'}
								stroke-linejoin={path.form !== 'Round' ? 'miter' : 'round'}
								fill="none"
								transform={rotate(path.positions)}
							/>
						{/if}
					{/if}
					{#if lastPosition && path.positions.length > 1 && path.form === 'Diamond'}
						{#if arrow}
							<rect
								height={size * 0.707}
								width={size * 0.707}
								x={cellSize * lastPosition.column + (cellSize - size * 0.707) * 0.5 + 10}
								y={cellSize * lastPosition.row + (cellSize - size * 0.707) * 0.5 + 10}
								dominant-baseline="middle"
								vector-effect="non-scaling-size"
								class={classNames(`stroke-current text-${color}`, 'fill-current')}
								transform={rotate(path.positions)}
							/>
							<rect
								height={size * 0.707}
								width={size * 0.707}
								x={cellSize * lastPosition.column + (cellSize - size * 0.707) * 0.5 + 10}
								y={cellSize * lastPosition.row + (cellSize - size * 0.707) * 0.5 - 10}
								dominant-baseline="middle"
								vector-effect="non-scaling-size"
								class={classNames(`stroke-current text-${color}`, 'fill-current')}
								transform={rotate(path.positions)}
							/>
						{:else}
							<rect
								height={size * 0.707}
								width={size * 0.707}
								x={cellSize * lastPosition.column + (cellSize - size * 0.707) * 0.5}
								y={cellSize * lastPosition.row + (cellSize - size * 0.707) * 0.5}
								dominant-baseline="middle"
								vector-effect="non-scaling-size"
								class={classNames(`stroke-current text-${color}`, 'fill-current')}
								transform={rotate(path.positions, 45)}
							/>
						{/if}
					{/if}
				{/each}
			{/each}
		{/each}
	</g>
{/if}
