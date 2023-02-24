<script lang="ts">
  import { cellSize, symbolsMap } from '$constants';
  import type { Dimensions, Logic } from '$models/Sudoku';
  import arrayfrom0ToN from '$utils/arrayfrom0ToN';

  export let logic: Logic;
  export let dimensions: Dimensions;
</script>

<g id="logic" class="select-none pointer-events-none">
  {#if logic.flags}
    {#each logic.flags as flag}
      {#if flag === 'DiagonalPos'}
        {#each arrayfrom0ToN(dimensions.rows - (dimensions.margins ? dimensions.margins.top + dimensions.margins.bottom : 0)) as _, rowIndex}
          <svelte:component
            this={symbolsMap.Diagonal}
            x={((dimensions.margins?.left ?? 0) + rowIndex) * cellSize}
            y={(dimensions.rows - (dimensions.margins?.bottom ?? 0) - rowIndex - 1) * cellSize}
            rotation={'East'}
            color={'Black'}
          />
        {/each}
      {:else if flag === 'DiagonalNeg'}
        {#each arrayfrom0ToN(dimensions.rows - (dimensions.margins ? dimensions.margins.top + dimensions.margins.bottom : 0)) as _, rowIndex}
          <svelte:component
            this={symbolsMap.Diagonal}
            x={((dimensions.margins?.left ?? 0) + rowIndex) * cellSize}
            y={((dimensions.margins?.top ?? 0) + rowIndex) * cellSize}
            rotation={'North'}
            color={'Black'}
          />
        {/each}
      {:else if flag === 'Indexed159' && dimensions.rows === 9 && dimensions.columns === 9}
        {#each arrayfrom0ToN(dimensions.rows - (dimensions.margins ? dimensions.margins.top + dimensions.margins.bottom : 0)) as _, rowIndex}
          <rect
            x={cellSize * (dimensions.margins?.left ?? 0)}
            y={cellSize * ((dimensions.margins?.top ?? 0) + rowIndex)}
            class="fill-current text-red w-cell h-cell opacity-60"
            vector-effect="non-scaling-size"
          />
          <rect
            x={cellSize * ((dimensions.margins?.left ?? 0) + 4)}
            y={cellSize * ((dimensions.margins?.top ?? 0) + rowIndex)}
            class="fill-current text-red w-cell h-cell opacity-60"
            vector-effect="non-scaling-size"
          />
          <rect
            x={cellSize * ((dimensions.margins?.left ?? 0) + 8)}
            y={cellSize * ((dimensions.margins?.top ?? 0) + rowIndex)}
            class="fill-current text-red w-cell h-cell opacity-60"
            vector-effect="non-scaling-size"
          />
        {/each}
      {/if}
    {/each}
  {/if}
</g>
