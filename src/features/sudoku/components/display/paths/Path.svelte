<script lang="ts">
	import { cellSize } from '$constants';
	import type { Path, Position } from '$models/Sudoku';
	import { getPathsToDraw } from '$utils/prefabs';
	import classNames from 'classnames';

	export let path: Path;
	export let onClick: (() => void) | undefined = undefined;
	let interactable = onClick != null;

	const MAX_WIDTH_FOR_ARROW = 20;
	const SIZE_SCALE = 0.707;

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

	function pathHasArrow(p: Path) {
		const lastPosition = p.positions[p.positions.length - 1];
		return (
			p.arrow === true &&
			p.positions.length > 1 &&
			lastPosition &&
			(p.width ?? 10) <= MAX_WIDTH_FOR_ARROW
		);
	}

	function getSizeOfPathAtStep(p: Path, step: number) {
		return step === 2 ? Math.max(getSize(p.width ?? 10) - 3, 0) : getSize(p.width ?? 10);
	}

	function getColorOfPathAtStep(p: Path, step: number) {
		return step === 2 ? 'white' : p.color?.toLowerCase() ?? 'black';
	}
</script>

{#each getPathsToDraw(path) as p}
	{@const firstPosition = p.positions[0]}
	{@const lastPosition = p.positions[p.positions.length - 1]}
	{@const hasArrow = pathHasArrow(p)}
	{#each p.fill === 'Hollow' ? [1, 2] : [1] as step}
		{@const size = getSizeOfPathAtStep(p, step)}
		{@const color = getColorOfPathAtStep(p, step)}
		{#if firstPosition != null && (p.positions.length === 1 || p.form === 'Diamond' || (p.form === 'Square' && hasArrow))}
			{#if p.form === 'Square'}
				<rect
					height={size}
					width={size}
					x={cellSize * firstPosition.column + (cellSize - size) * 0.5}
					y={cellSize * firstPosition.row + (cellSize - size) * 0.5}
					dominant-baseline="middle"
					vector-effect="non-scaling-size"
					class={classNames(
						`stroke-current text-${color}`,
						'fill-current',
						interactable && 'cursor-pointer'
					)}
					transform={rotate(p.positions, 0, true)}
					on:click={() => onClick?.()}
					on:keypress={() => onClick?.()}
				/>
			{:else if p.form === 'Diamond'}
				<rect
					height={size * SIZE_SCALE}
					width={size * SIZE_SCALE}
					x={cellSize * firstPosition.column + (cellSize - size * SIZE_SCALE) * 0.5}
					y={cellSize * firstPosition.row + (cellSize - size * SIZE_SCALE) * 0.5}
					dominant-baseline="middle"
					vector-effect="non-scaling-size"
					class={classNames(
						`stroke-current text-${color}`,
						'fill-current',
						interactable && 'cursor-pointer'
					)}
					transform={rotate(p.positions, 45, true)}
					on:click={() => onClick?.()}
					on:keypress={() => onClick?.()}
				/>
			{:else}
				<circle
					cx={cellSize * (firstPosition.column + 0.5)}
					cy={cellSize * (firstPosition.row + 0.5)}
					r={size * 0.5}
					class={classNames(
						`stroke-current text-${color}`,
						'fill-current',
						interactable && 'cursor-pointer'
					)}
					on:click={() => onClick?.()}
					on:keypress={() => onClick?.()}
				/>
			{/if}
		{/if}
		{#if p.positions.length > 1}
			<path
				d={createPaths(p.positions)}
				class={classNames(`stroke-current text-${color}`, interactable && 'cursor-pointer')}
				stroke-width={size + 1}
				stroke-linecap={p.form === 'Diamond' || (p.form === 'Square' && hasArrow)
					? 'butt'
					: p.form === 'Square'
					? 'square'
					: 'round'}
				stroke-linejoin={p.form !== 'Round' ? 'miter' : 'round'}
				stroke-miterlimit="5"
				fill="none"
				on:click={() => onClick?.()}
				on:keypress={() => onClick?.()}
			/>
			{#if hasArrow}
				<path
					d={createArrow(lastPosition)}
					class={classNames('stroke-current text-${color}', interactable && 'cursor-pointer')}
					stroke-width={size + 1}
					stroke-linecap={p.form === 'Diamond' ? 'butt' : p.form === 'Square' ? 'square' : 'round'}
					stroke-linejoin={p.form !== 'Round' ? 'miter' : 'round'}
					fill="none"
					transform={rotate(p.positions)}
					on:click={() => onClick?.()}
					on:keypress={() => onClick?.()}
				/>
			{/if}
		{/if}
		{#if lastPosition && p.positions.length > 1 && p.form === 'Diamond'}
			{#if hasArrow}
				<rect
					height={size * SIZE_SCALE}
					width={size * SIZE_SCALE}
					x={cellSize * lastPosition.column + (cellSize - size * SIZE_SCALE) * 0.5 + 10}
					y={cellSize * lastPosition.row + (cellSize - size * SIZE_SCALE) * 0.5 + 10}
					dominant-baseline="middle"
					vector-effect="non-scaling-size"
					class={classNames(
						`stroke-current text-${color}`,
						'fill-current',
						interactable && 'cursor-pointer'
					)}
					transform={rotate(p.positions)}
					on:click={() => onClick?.()}
					on:keypress={() => onClick?.()}
				/>
				<rect
					height={size * SIZE_SCALE}
					width={size * SIZE_SCALE}
					x={cellSize * lastPosition.column + (cellSize - size * SIZE_SCALE) * 0.5 + 10}
					y={cellSize * lastPosition.row + (cellSize - size * SIZE_SCALE) * 0.5 - 10}
					dominant-baseline="middle"
					vector-effect="non-scaling-size"
					class={classNames(
						`stroke-current text-${color}`,
						'fill-current',
						interactable && 'cursor-pointer'
					)}
					transform={rotate(p.positions)}
					on:click={() => onClick?.()}
					on:keypress={() => onClick?.()}
				/>
			{:else}
				<rect
					height={size * SIZE_SCALE}
					width={size * SIZE_SCALE}
					x={cellSize * lastPosition.column + (cellSize - size * SIZE_SCALE) * 0.5}
					y={cellSize * lastPosition.row + (cellSize - size * SIZE_SCALE) * 0.5}
					dominant-baseline="middle"
					vector-effect="non-scaling-size"
					class={classNames(
						`stroke-current text-${color}`,
						'fill-current',
						interactable && 'cursor-pointer'
					)}
					transform={rotate(p.positions, 45)}
					on:click={() => onClick?.()}
					on:keypress={() => onClick?.()}
				/>
			{/if}
		{/if}
	{/each}
{/each}
