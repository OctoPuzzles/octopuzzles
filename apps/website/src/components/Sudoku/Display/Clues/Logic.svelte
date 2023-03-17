<script lang="ts">
  import { symbolsMap } from '$constants';
  import type { Dimensions, Logic } from '@octopuzzles/models';
  import { CELL_SIZE } from '@octopuzzles/models';
  import { arrayfrom0ToN } from '@octopuzzles/utils';

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
            x={((dimensions.margins?.left ?? 0) + rowIndex) * CELL_SIZE}
            y={(dimensions.rows - (dimensions.margins?.bottom ?? 0) - rowIndex - 1) * CELL_SIZE}
            rotation={'East'}
            color={'Black'}
          />
        {/each}
      {:else if flag === 'DiagonalNeg'}
        {#each arrayfrom0ToN(dimensions.rows - (dimensions.margins ? dimensions.margins.top + dimensions.margins.bottom : 0)) as _, rowIndex}
          <svelte:component
            this={symbolsMap.Diagonal}
            x={((dimensions.margins?.left ?? 0) + rowIndex) * CELL_SIZE}
            y={((dimensions.margins?.top ?? 0) + rowIndex) * CELL_SIZE}
            rotation={'North'}
            color={'Black'}
          />
        {/each}
      {:else if flag === 'Indexed159' && dimensions.rows === 9 && dimensions.columns === 9}
        {#each arrayfrom0ToN(dimensions.rows - (dimensions.margins ? dimensions.margins.top + dimensions.margins.bottom : 0)) as _, rowIndex}
          <rect
            x={CELL_SIZE * (dimensions.margins?.left ?? 0)}
            y={CELL_SIZE * ((dimensions.margins?.top ?? 0) + rowIndex)}
            class="fill-current text-red w-cell h-cell opacity-60"
            vector-effect="non-scaling-size"
          />
          <rect
            x={CELL_SIZE * ((dimensions.margins?.left ?? 0) + 4)}
            y={CELL_SIZE * ((dimensions.margins?.top ?? 0) + rowIndex)}
            class="fill-current text-red w-cell h-cell opacity-60"
            vector-effect="non-scaling-size"
          />
          <rect
            x={CELL_SIZE * ((dimensions.margins?.left ?? 0) + 8)}
            y={CELL_SIZE * ((dimensions.margins?.top ?? 0) + rowIndex)}
            class="fill-current text-red w-cell h-cell opacity-60"
            vector-effect="non-scaling-size"
          />
        {/each}
      {/if}
    {/each}
  {/if}
</g>
