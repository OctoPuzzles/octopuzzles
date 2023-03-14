<script lang="ts">
  import { cellSize } from '$constants';
  import type { Dimensions, Givens } from '@octopuzzles/models';
  import type { GameValues } from '@octopuzzles/models';
  import arrayfrom0ToN from '$utils/arrayfrom0ToN';
  import classNames from 'classnames';

  export let givens: Givens;
  export let values: GameValues | undefined;

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
    {/each}
  {/each}
</g>
