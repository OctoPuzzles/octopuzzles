<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { CellValues, EditorColors } from '@octopuzzles/models';

  export let editorColors: EditorColors;
  export let cellValues: CellValues | undefined;

  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ): { x: number; y: number } {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  function describeArc(i: number, numColors: number, row: number, column: number): string {
    const x = 64 * (column + 0.5);
    const y = 64 * (row + 0.5);
    const radius = 64;
    const angleOffset = 225;
    const startAngle = (360 / numColors) * i + angleOffset;
    const endAngle = (360 / numColors) * (i + 1) - (numColors === 1 ? 0.0001 : 0) + angleOffset;
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      x,
      y,
      'L',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'Z'
    ].join(' ');
  }
</script>

<g id="colors" class="select-none pointer-events-none">
  {#each editorColors as colors, row}
    {#each colors as editorColor, column}
      {@const cell = cellValues?.[row]?.[column]}
      {@const gameColors = cell?.colors}
      {#if editorColor != null}
        <rect
          x={CELL_SIZE * column}
          y={CELL_SIZE * row}
          width={CELL_SIZE}
          height={CELL_SIZE}
          class="fill-current text-{editorColor.toLowerCase()} opacity-60"
          vector-effect="non-scaling-size"
        />
      {/if}
      {#if gameColors != null}
        <clipPath id="square-{row}-{column}" clipPathUnits="userSpaceOnUse">
          <rect x={CELL_SIZE * column} y={CELL_SIZE * row} width={CELL_SIZE} height={CELL_SIZE} />
        </clipPath>
        <g clip-path="url(#square-{row}-{column})">
          {#each gameColors as color, i}
            <path
              width={CELL_SIZE}
              height={CELL_SIZE}
              d={describeArc(i, gameColors.length, row, column)}
              class="fill-current text-{color.toLowerCase()} opacity-60"
            />
          {/each}
        </g>
      {/if}
    {/each}
  {/each}
</g>
