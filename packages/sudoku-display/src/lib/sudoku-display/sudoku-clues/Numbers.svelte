<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Givens, CellValues } from '@octopuzzles/models';
  import classNames from 'classnames';

  export let givens: Givens;
  export let cellValues: CellValues | undefined;

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
  {#each givens as givenDigits, row}
    {#each givenDigits as given, column}
      {@const isGiven = given !== ''}
      {@const cell = cellValues?.[row]?.[column]}
      {@const digits = isGiven ? [given] : cell?.digits}
      {#if digits != null}
        {@const val = digits.join('')}
        <text
          x={CELL_SIZE * (column + 0.5)}
          y={CELL_SIZE * (row + 0.55)}
          dominant-baseline="middle"
          class={classNames(
            'fill-current text-4xl textanchor-middle',
            { 'text-black': isGiven },
            { 'text-blue-700': !isGiven }
          )}
          style="font-size: {fontSize(val)};"
        >
          {val}
        </text>
      {/if}
    {/each}
  {/each}
</g>
