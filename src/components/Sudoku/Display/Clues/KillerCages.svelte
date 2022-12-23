<script lang="ts">
  import { cellSize } from '$constants';
  import classNames from 'classnames';
  import { inputMode, highlights } from '$stores/sudokuStore';
  import { topLeftOfPositions } from '$utils/topLeftOfPositions';
  import { createEdges } from '$utils/createEdges';
  import type { Dimensions, Extendedcages } from '$models/Sudoku';

  const { selectedItemIndex, highlightedItemIndex } = highlights;
  export let cages: Extendedcages;

  export let dimensions: Dimensions;
</script>

{#if cages.length > 0}
  <g id="killer-cages" class="select-none pointer-events-none">
    <!-- White background -->
    <defs>
      <filter x="0" y="0" width="1" height="1" id="solid">
        <feFlood flood-color="white" result="bg" />
        <feMerge>
          <feMergeNode in="bg" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {#each cages as cage, i}
      {@const topLeft = topLeftOfPositions(cage.positions)}
      {#each createEdges(cage.positions, dimensions, 0.1) as edge}
        <line
          class={classNames('stroke-current', {
            [`text-${cage.color?.toLowerCase()}`]: cage.color != null,
            'text-blue-700':
              $inputMode === 'cages' && cage.color == null && $highlightedItemIndex === i,
            'text-orange-600':
              $inputMode === 'cages' && cage.color == null && $selectedItemIndex === i
          })}
          x1={edge.x1 * cellSize}
          y1={edge.y1 * cellSize}
          x2={edge.x2 * cellSize}
          y2={edge.y2 * cellSize}
        />
      {/each}
      {#if cage.text && cage.text.length > 0}
        <text
          class={classNames('stroke-current', {
            [`text-${cage.color?.toLowerCase()}`]: cage.color != null,
            'text-blue-700':
              $inputMode === 'cages' && cage.color == null && $highlightedItemIndex === i,
            'text-orange-600':
              $inputMode === 'cages' && cage.color == null && $selectedItemIndex === i
          })}
          x={cellSize * topLeft.column + 2}
          y={cellSize * topLeft.row + 2}
          width={cellSize}
          height={cellSize}
          filter="url(#solid)"
          dominant-baseline="hanging">{cage.text}</text
        >
      {/if}
    {/each}
  </g>
{/if}

<style>
  line {
    stroke-dasharray: 3 5;
    stroke-width: 1.5px;
    stroke-linecap: square;
  }
  text {
    font-size: 0.75rem;
  }
</style>
