<script lang="ts">
  import { cellSize } from '../constants';
  import { page } from '$app/stores';
  import type { Position } from '$models/Sudoku';

  $: firstNumber = Math.floor($page.status / 100);
  $: secondNumber = Math.floor(($page.status - firstNumber * 100) / 10);
  $: thirdNumber = $page.status - firstNumber * 100 - secondNumber * 10;

  const positionsForNumber = (number: number, index: number): Position[] => {
    let offsetRow = index * 2;
    let offsetCol = index * 3;
    switch (number as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) {
      case 0:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 0 + offsetRow, column: 2 + offsetCol },
          { row: 1 + offsetRow, column: 0 + offsetCol },
          { row: 1 + offsetRow, column: 2 + offsetCol },
          { row: 2 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 2 + offsetCol },
          { row: 3 + offsetRow, column: 0 + offsetCol },
          { row: 3 + offsetRow, column: 2 + offsetCol },
          { row: 4 + offsetRow, column: 0 + offsetCol },
          { row: 4 + offsetRow, column: 1 + offsetCol },
          { row: 4 + offsetRow, column: 2 + offsetCol }
        ];
      case 1:
        return [
          { row: 1 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 1 + offsetRow, column: 1 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 3 + offsetRow, column: 1 + offsetCol },
          { row: 4 + offsetRow, column: 0 + offsetCol },
          { row: 4 + offsetRow, column: 1 + offsetCol },
          { row: 4 + offsetRow, column: 2 + offsetCol }
        ];
      case 2:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 1 + offsetRow, column: 2 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 3 + offsetRow, column: 0 + offsetCol },
          { row: 4 + offsetRow, column: 0 + offsetCol },
          { row: 4 + offsetRow, column: 1 + offsetCol },
          { row: 4 + offsetRow, column: 2 + offsetCol }
        ];
      case 3:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 1 + offsetRow, column: 2 + offsetCol },
          { row: 2 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 3 + offsetRow, column: 2 + offsetCol },
          { row: 4 + offsetRow, column: 0 + offsetCol },
          { row: 4 + offsetRow, column: 1 + offsetCol }
        ];
      case 4:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 2 + offsetCol },
          { row: 1 + offsetRow, column: 0 + offsetCol },
          { row: 1 + offsetRow, column: 2 + offsetCol },
          { row: 2 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 2 + offsetRow, column: 2 + offsetCol },
          { row: 3 + offsetRow, column: 2 + offsetCol },
          { row: 4 + offsetRow, column: 2 + offsetCol }
        ];
      case 5:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 0 + offsetRow, column: 2 + offsetCol },
          { row: 1 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 3 + offsetRow, column: 2 + offsetCol },
          { row: 4 + offsetRow, column: 0 + offsetCol },
          { row: 4 + offsetRow, column: 1 + offsetCol }
        ];
      case 6:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 0 + offsetRow, column: 2 + offsetCol },
          { row: 1 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 2 + offsetRow, column: 2 + offsetCol },
          { row: 3 + offsetRow, column: 0 + offsetCol },
          { row: 3 + offsetRow, column: 2 + offsetCol },
          { row: 4 + offsetRow, column: 0 + offsetCol },
          { row: 4 + offsetRow, column: 1 + offsetCol },
          { row: 4 + offsetRow, column: 2 + offsetCol }
        ];
      case 7:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 0 + offsetRow, column: 2 + offsetCol },
          { row: 1 + offsetRow, column: 2 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 3 + offsetRow, column: 1 + offsetCol },
          { row: 4 + offsetRow, column: 1 + offsetCol }
        ];
      case 8:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 0 + offsetRow, column: 2 + offsetCol },
          { row: 1 + offsetRow, column: 0 + offsetCol },
          { row: 1 + offsetRow, column: 2 + offsetCol },
          { row: 2 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 2 + offsetRow, column: 2 + offsetCol },
          { row: 3 + offsetRow, column: 0 + offsetCol },
          { row: 3 + offsetRow, column: 2 + offsetCol },
          { row: 4 + offsetRow, column: 0 + offsetCol },
          { row: 4 + offsetRow, column: 1 + offsetCol },
          { row: 4 + offsetRow, column: 2 + offsetCol }
        ];
      case 9:
        return [
          { row: 0 + offsetRow, column: 0 + offsetCol },
          { row: 0 + offsetRow, column: 1 + offsetCol },
          { row: 0 + offsetRow, column: 2 + offsetCol },
          { row: 1 + offsetRow, column: 0 + offsetCol },
          { row: 1 + offsetRow, column: 2 + offsetCol },
          { row: 2 + offsetRow, column: 0 + offsetCol },
          { row: 2 + offsetRow, column: 1 + offsetCol },
          { row: 2 + offsetRow, column: 2 + offsetCol },
          { row: 3 + offsetRow, column: 2 + offsetCol },
          { row: 4 + offsetRow, column: 2 + offsetCol }
        ];
    }
  };
</script>

<svelte:head>
  <title>{$page.status} | OctoPuzzles</title>
</svelte:head>

<div class="p-4">
  <div class="flex items-center justify-around">
    <div class="max-w-full w-80">
      <svg viewBox="-2 -2 580 580">
        <g id="cells">
          {#each [0, 1, 2, 3, 4, 5, 6, 7, 8] as rowIndex}
            {#each [0, 1, 2, 3, 4, 5, 6, 7, 8] as columnIndex}
              <rect
                x={cellSize * columnIndex}
                y={cellSize * rowIndex}
                vector-effect="non-scaling-size"
                class="w-cell h-cell stroke-black fill-none stroke-0.5"
              />
            {/each}
          {/each}
          {#each [0, 1, 2] as rowIndex}
            {#each [0, 1, 2] as columnIndex}
              <rect
                x={3 * cellSize * columnIndex}
                y={3 * cellSize * rowIndex}
                vector-effect="non-scaling-size"
                class="w-3cell h-3cell stroke-black fill-none stroke-3"
              />
            {/each}
          {/each}
        </g>
        <g id="numbers">
          {#each [firstNumber, secondNumber, thirdNumber] as n, i}
            {#each positionsForNumber(n, i) as position}
              <text
                x={cellSize * (position.column + 0.5)}
                y={cellSize * (position.row + 0.55)}
                dominant-baseline="middle"
                class="text-white text-5xl"
                style="text-anchor: middle;"
              >
                {n}
              </text>
            {/each}
          {/each}
        </g>
      </svg>
    </div>

    <h1 class="text-3xl font-medium">
      {$page.status} : {$page.error?.message || 'Something went wrong'}
    </h1>
  </div>
</div>
<slot />
