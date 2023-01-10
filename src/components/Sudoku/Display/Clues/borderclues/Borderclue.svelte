<script lang="ts">
	import { cellSize } from '$constants';
	import type { Borderclue } from '$models/Sudoku';
	import { getBorderCluesToDraw } from '$utils/constraints/borderclues';
	import classNames from 'classnames';

	let propBorderclue: Borderclue;
	export { propBorderclue as borderclue };

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

	function getStarPoints(x: number, y: number, radius: number): string {
		const innerRadius = radius * 0.5 * (3 - Math.sqrt(5));
		const angle = 2 * Math.PI * 0.2;
		const halfAngle = angle * 0.5;
		const points: { x: number; y: number }[] = [];
		for (const i of [0, 1, 2, 3, 4]) {
			points.push({ x: x + radius * Math.sin(i * angle), y: y - radius * Math.cos(i * angle) });
			points.push({
				x: x + innerRadius * Math.sin(i * angle + halfAngle),
				y: y - innerRadius * Math.cos(i * angle + halfAngle)
			});
		}
		return points.map((p) => `${p.x},${p.y}`).join(' ');
	}

	function borderCluesFontSize(s: string, radius: number): string {
		let size = 0;
		switch (s.length) {
			case 1:
				size = 2;
				break;
			case 2:
				size = 1.2;
				break;
			case 3:
				size = 0.8;
				break;
			case 4:
				size = 0.5;
				break;
			case 0:
			default:
				break;
		}

		return (size * radius) / 32 + 'rem';
	}
</script>

{#each getBorderCluesToDraw(propBorderclue) as borderclue}
	{@const values = borderclue.text?.split(',') ?? null}
	{@const radius = adjustedRadius(borderclue.radius ?? 10)}
	{@const fontSize = borderCluesFontSize(
		(values?.length ?? 0) > 1 ? '123' : borderclue.text ?? '',
		borderclue.radius ?? 10
	)}
	{@const x = cx(borderclue)}
	{@const y = cy(borderclue)}
	{@const firstPosition = borderclue.positions[0]}
	{@const secondPosition = borderclue.positions[1]}
	<g>
		{#if borderclue.shape === 'Line'}
			<line
				x1={(x + 0.5) * cellSize - (firstPosition.row - secondPosition.row) * radius}
				y1={(y + 0.5) * cellSize + (firstPosition.column - secondPosition.column) * radius}
				x2={(x + 0.5) * cellSize + (firstPosition.row - secondPosition.row) * radius}
				y2={(y + 0.5) * cellSize - (firstPosition.column - secondPosition.column) * radius}
				class={`stroke-current stroke-3 cursor text-${borderclue.color?.toLowerCase() ?? 'white'}`}
				stroke-linecap="square"
			/>
		{:else if borderclue.shape === 'Circle'}
			<circle
				cx={(x + 0.5) * cellSize}
				cy={(y + 0.5) * cellSize}
				r={radius}
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1"
				class={classNames(
					`fill-current`,
					borderclue.color != null
						? `stroke-black text-${borderclue.color.toLowerCase()}`
						: 'stroke-current text-white-500'
				)}
			/>
		{:else if borderclue.shape === 'Square'}
			<rect
				x={(x + 0.5) * cellSize - radius}
				y={(y + 0.5) * cellSize - radius}
				width={radius * 2}
				height={radius * 2}
				rx="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1"
				class={classNames(
					`fill-current`,
					borderclue.color != null
						? `stroke-black text-${borderclue.color.toLowerCase()}`
						: 'stroke-current text-white-500'
				)}
			/>
		{:else if borderclue.shape === 'Diamond'}
			<g transform="rotate(45 {(x + 0.5) * cellSize} {(y + 0.5) * cellSize})">
				<rect
					x={(x + 0.5) * cellSize - radius / 2}
					y={(y + 0.5) * cellSize - radius / 2}
					width={radius}
					height={radius}
					rx="1"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1"
					class={classNames(
						`fill-current`,
						borderclue.color != null
							? `stroke-black text-${borderclue.color.toLowerCase()}`
							: 'stroke-current text-white-500'
					)}
				/>
			</g>
		{:else if borderclue.shape === 'Star'}
			<polygon
				points={getStarPoints((x + 0.5) * cellSize, (y + 0.5) * cellSize, radius)}
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1"
				class={classNames(
					`fill-current`,
					borderclue.color != null
						? `stroke-black text-${borderclue.color.toLowerCase()}`
						: 'stroke-current text-white-500'
				)}
			/>
		{/if}

		{#if values}
			{#each values as value, index}
				{@const xOffset =
					index % 2 === 1 || index < values.length - 1 ? 0.4 * radius * (2 * (index % 2) - 1) : 0}
				{@const yOffset = values.length > 2 ? 0.4 * radius * (2 * Math.floor(index / 2) - 1) : 0}
				<text
					class={classNames(
						'fill-current',
						['Black', 'Gray'].includes(borderclue.color ?? 'None') ? 'text-white' : 'text-black'
					)}
					x={(x + 0.5) * cellSize + xOffset}
					y={(y + 0.52) * cellSize + yOffset}
					dominant-baseline="middle"
					style="font-size: {fontSize};"
				>
					{value}
				</text>
			{/each}
		{/if}
	</g>
{/each}

<style>
	text {
		text-anchor: middle;
		font-weight: 600;
	}
</style>
