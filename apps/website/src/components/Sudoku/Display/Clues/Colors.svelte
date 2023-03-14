<script lang="ts">
  import { cellSize } from '$constants';
  import type { Dimensions, EditorColors } from '@octopuzzles/models';
  import type { GameColors } from '@octopuzzles/models';
  import arrayfrom0ToN from '$utils/arrayfrom0ToN';

  export let editorColors: EditorColors;
  export let gameColors: GameColors | undefined;
  export let dimensions: Dimensions;

  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ): { x: number; y: number } {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  function describeArc(i: number, numColors: number, row: number, column: number): string {
    const x = 64 * (column + 0.5);
    const y = 64 * (row + 0.5);
    const radius = 64;
    const startAngle = (360 / numColors) * i;
    const endAngle = (360 / numColors) * (i + 1) - (numColors === 1 ? 0.0001 : 0);
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    var d = [
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

    return d;
  }
</script>

<g id="colors" class="select-none pointer-events-none">
  {#each arrayfrom0ToN(dimensions.rows) as row}
    {#each arrayfrom0ToN(dimensions.columns) as column}
      {@const editorColor = editorColors[row][column]}
      {@const gameColor = gameColors?.[row]?.[column]}
      {#if editorColor}
        <rect
          x={cellSize * column}
          y={cellSize * row}
          class="fill-current text-{editorColor.toLowerCase()} w-cell h-cell opacity-60"
          vector-effect="non-scaling-size"
        />
      {/if}
      {#if gameColor && gameColor.length > 0}
        <clipPath id="square-{row}-{column}" clipPathUnits="userSpaceOnUse">
          <rect x={cellSize * column} y={cellSize * row} width={cellSize} height={cellSize} />
        </clipPath>
        {#each gameColor as color, i}
          <path
            d={describeArc(i, gameColor.length, row, column)}
            clip-path="url(#square-{row}-{column})"
            class="fill-current text-{color.toLowerCase()} w-cell h-cell opacity-60"
          />
        {/each}
      {/if}
    {/each}
  {/each}
</g>
