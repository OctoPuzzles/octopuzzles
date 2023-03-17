<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Path, Position } from '@octopuzzles/models';
  import { getPathsToDraw } from '@octopuzzles/sudoku-utils';
  import classNames from 'classnames';

  export let path: Path;

  const MAX_WIDTH_FOR_ARROW = 20;
  const SIZE_SCALE = 0.707;

  function createPaths(positions: Position[]): string {
    let d = '';
    positions.forEach((cell, i) => {
      const letter = i === 0 ? 'M' : 'L';
      d += `${letter}${(cell.column + 0.5) * CELL_SIZE} ${(cell.row + 0.5) * CELL_SIZE} `;
    });

    return d;
  }

  function createArrow({ row, column }: Position): string {
    let d = `
			M${(column + 0.5) * CELL_SIZE + 10} ${(row + 0.5) * CELL_SIZE + 10}
			L${(column + 0.5) * CELL_SIZE} ${(row + 0.5) * CELL_SIZE}
			L${(column + 0.5) * CELL_SIZE + 10} ${(row + 0.5) * CELL_SIZE - 10}
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
    return `rotate(${degrees} ${(last.column + 0.5) * CELL_SIZE} ${(last.row + 0.5) * CELL_SIZE})`;
  }

  function getSize(width: number): number {
    return (CELL_SIZE * width) / 100;
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
          x={CELL_SIZE * firstPosition.column + (CELL_SIZE - size) * 0.5}
          y={CELL_SIZE * firstPosition.row + (CELL_SIZE - size) * 0.5}
          dominant-baseline="middle"
          vector-effect="non-scaling-size"
          class={classNames(`stroke-current text-${color}`, 'fill-current')}
          transform={rotate(p.positions, 0, true)}
        />
      {:else if p.form === 'Diamond'}
        <rect
          height={size * SIZE_SCALE}
          width={size * SIZE_SCALE}
          x={CELL_SIZE * firstPosition.column + (CELL_SIZE - size * SIZE_SCALE) * 0.5}
          y={CELL_SIZE * firstPosition.row + (CELL_SIZE - size * SIZE_SCALE) * 0.5}
          dominant-baseline="middle"
          vector-effect="non-scaling-size"
          class={classNames(`stroke-current text-${color}`, 'fill-current')}
          transform={rotate(p.positions, 45, true)}
        />
      {:else}
        <circle
          cx={CELL_SIZE * (firstPosition.column + 0.5)}
          cy={CELL_SIZE * (firstPosition.row + 0.5)}
          r={size * 0.5}
          class={classNames(`stroke-current text-${color}`, 'fill-current')}
        />
      {/if}
    {/if}
    {#if p.positions.length > 1}
      <path
        d={createPaths(p.positions)}
        class={`stroke-current text-${color}`}
        stroke-width={size + 1}
        stroke-linecap={p.form === 'Diamond' || (p.form === 'Square' && hasArrow)
          ? 'butt'
          : p.form === 'Square'
          ? 'square'
          : 'round'}
        stroke-linejoin={p.form !== 'Round' ? 'miter' : 'round'}
        stroke-miterlimit="5"
        fill="none"
      />
      {#if hasArrow}
        <path
          d={createArrow(lastPosition)}
          class={`stroke-current text-${color}`}
          stroke-width={size + 1}
          stroke-linecap={p.form === 'Diamond' ? 'butt' : p.form === 'Square' ? 'square' : 'round'}
          stroke-linejoin={p.form !== 'Round' ? 'miter' : 'round'}
          fill="none"
          transform={rotate(p.positions)}
        />
      {/if}
    {/if}
    {#if lastPosition && p.positions.length > 1 && p.form === 'Diamond'}
      {#if hasArrow}
        <rect
          height={size * SIZE_SCALE}
          width={size * SIZE_SCALE}
          x={CELL_SIZE * lastPosition.column + (CELL_SIZE - size * SIZE_SCALE) * 0.5 + 10}
          y={CELL_SIZE * lastPosition.row + (CELL_SIZE - size * SIZE_SCALE) * 0.5 + 10}
          dominant-baseline="middle"
          vector-effect="non-scaling-size"
          class={classNames(`stroke-current text-${color}`, 'fill-current')}
          transform={rotate(p.positions)}
        />
        <rect
          height={size * SIZE_SCALE}
          width={size * SIZE_SCALE}
          x={CELL_SIZE * lastPosition.column + (CELL_SIZE - size * SIZE_SCALE) * 0.5 + 10}
          y={CELL_SIZE * lastPosition.row + (CELL_SIZE - size * SIZE_SCALE) * 0.5 - 10}
          dominant-baseline="middle"
          vector-effect="non-scaling-size"
          class={classNames(`stroke-current text-${color}`, 'fill-current')}
          transform={rotate(p.positions)}
        />
      {:else}
        <rect
          height={size * SIZE_SCALE}
          width={size * SIZE_SCALE}
          x={CELL_SIZE * lastPosition.column + (CELL_SIZE - size * SIZE_SCALE) * 0.5}
          y={CELL_SIZE * lastPosition.row + (CELL_SIZE - size * SIZE_SCALE) * 0.5}
          dominant-baseline="middle"
          vector-effect="non-scaling-size"
          class={classNames(`stroke-current text-${color}`, 'fill-current')}
          transform={rotate(p.positions, 45)}
        />
      {/if}
    {/if}
  {/each}
{/each}
