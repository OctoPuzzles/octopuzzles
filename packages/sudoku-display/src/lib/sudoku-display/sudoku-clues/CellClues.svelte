<script lang="ts">
  import { symbolsMap } from '$lib/constants';
  import classNames from 'classnames';
  import { getCellCluesToDraw } from '@octopuzzles/sudoku-utils';
  import type { CellClueLocation, Cellclues, CellClueSize } from '@octopuzzles/models';
  import { CELL_SIZE } from '@octopuzzles/models';

  export let cellClues: Cellclues;

  const horizontalOffset = (l?: CellClueLocation | null) => {
    switch (l) {
      case 'Top':
      case 'Center':
      case 'Bottom':
        return 0.5;
      case 'TopRight':
      case 'Right':
      case 'BottomRight':
        return 0.8;
      case 'TopLeft':
      case 'Left':
      case 'BottomLeft':
      default:
        return 0.2;
    }
  };

  const verticalOffset = (l?: CellClueLocation | null) => {
    switch (l) {
      case 'Left':
      case 'Center':
      case 'Right':
        return 0.5;
      case 'BottomLeft':
      case 'Bottom':
      case 'BottomRight':
        return 0.8;
      case 'TopLeft':
      case 'Top':
      case 'TopRight':
      default:
        return 0.2;
    }
  };

  export function cellCluesFontSize(s: string, size?: CellClueSize | null): string {
    let scale = 0;
    switch (s.length) {
      case 1:
        scale = 2;
        break;
      case 2:
        scale = 1.8;
        break;
      case 3:
        scale = 1.62;
        break;
      case 4:
        scale = 1.43;
        break;
      case 0:
      default:
        break;
    }

    switch (size) {
      case 'Large':
        return scale * 1.2 + 'rem';
      case 'Small':
        return scale * 0.5 + 'rem';
      case 'XSmall':
        return scale * 0.25 + 'rem';
      case 'Medium':
      default:
        return scale * 0.85 + 'rem';
    }
  }
</script>

{#if cellClues.length > 0}
  <g id="cellclues">
    {#each cellClues as editorClue}
      {#each getCellCluesToDraw(editorClue) as cellClue, index}
        <g class="pointer-events-none">
          {#if cellClue.text && cellClue.text.length > 0}
            <text
              x={CELL_SIZE * (cellClue.position.column + horizontalOffset(cellClue.location))}
              y={CELL_SIZE * (cellClue.position.row + verticalOffset(cellClue.location))}
              dominant-baseline="middle"
              class={classNames(
                'fill-current text-4xl textanchor-middle',
                `text-${cellClue.color?.toLowerCase()}`
              )}
              style="font-size: {cellCluesFontSize(cellClue.text, cellClue.size)};"
            >
              {cellClue.text}
            </text>
          {/if}
          {#if cellClue.symbol && cellClue.color}
            <svelte:component
              this={symbolsMap[cellClue.symbol]}
              x={cellClue.position.column * CELL_SIZE}
              y={cellClue.position.row * CELL_SIZE}
              rotation={cellClue.rotation}
              color={cellClue.color}
            />
          {/if}
        </g>
      {/each}
    {/each}
  </g>
{/if}

<style>
  text {
    text-anchor: middle;
    font-weight: 600;
  }
</style>
