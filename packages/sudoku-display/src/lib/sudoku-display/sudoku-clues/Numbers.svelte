<script lang="ts">
  import { CELL_SIZE } from '@octopuzzles/models';
  import type { Givens, CellValues } from '@octopuzzles/models';
  import classNames from 'classnames';

  export let givens: Givens;
  export let cellValues: CellValues | undefined;
</script>

<g id="numbers" class="select-none pointer-events-none">
  {#each givens as givenDigits, row}
    {#each givenDigits as given, column}
      {@const isGiven = !!given}
      {@const cell = cellValues?.[row]?.[column]}
      {@const digits = isGiven ? [given] : cell?.digits}
      {#if digits}
        {@const sCell = cell?.modifiers?.some((m) => m === 'SCell')}
        <text
          x={CELL_SIZE * (column + (sCell ? 0.25 : 0.5))}
          y={CELL_SIZE * (row + (sCell ? 0.3 : 0.55))}
          dominant-baseline="middle"
          class={classNames(
            'fill-current text-4xl textanchor-middle',
            { 'text-black': isGiven },
            { 'text-blue-700': !isGiven }
          )}
          style="font-size: {sCell ? '1.7rem' : '2.4rem'};"
        >
          {digits[0]}
        </text>
        {#if sCell && digits.length > 1}
          <text
            x={CELL_SIZE * (column + 0.75)}
            y={CELL_SIZE * (row + 0.8)}
            dominant-baseline="middle"
            class={classNames(
              'fill-current text-4xl textanchor-middle',
              { 'text-black': isGiven },
              { 'text-blue-700': !isGiven }
            )}
            style="font-size: {sCell ? '1.7rem' : '2.4rem'};"
          >
            {digits[1]}
          </text>
        {/if}
      {/if}
    {/each}
  {/each}
</g>
