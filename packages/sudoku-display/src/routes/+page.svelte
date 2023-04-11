<script lang="ts">
  import { SudokuDisplay } from '$lib';

  let actions: string[] = [];

  function addAction(action: string) {
    actions = [...actions, action];
  }

  let showHitboxes = false;
</script>

<div
  class="h-screen p-8 flex gap-8"
  style={showHitboxes
    ? '--corner-color: rgb(255,0,0, 0.2); --border-color: rgb(0,255,0,0.2); --center-color: rgb(0,0,255,0.2);'
    : '--corner-color: transparent; --border-color: transparent; --center-color: transparent;'}
>
  <SudokuDisplay
    onClickNote={(note, { row, column }) =>
      addAction(`NOTE CLICKED: Position (${row}, ${column}), "${note}"`)}
    onClickCell={(cell, metaButtonClicked) =>
      addAction(`CELL CLICKED: Position (${cell.row}, ${cell.column}), META: ${metaButtonClicked}`)}
    onEnterCell={(cell, metaButtonClicked) =>
      addAction(`CELL ENTERED: Position (${cell.row}, ${cell.column}), META: ${metaButtonClicked}`)}
    onClickCellCenter={showHitboxes
      ? ({ row, column }) => addAction(`CELL CENTER CLICKED: Position (${row}, ${column})`)
      : undefined}
    onEnterCellCenter={showHitboxes
      ? ({ row, column }) => addAction(`CELL CENTER ENTERED: Position (${row}, ${column})`)
      : undefined}
    onClickBorder={showHitboxes
      ? ({ row, column }) => addAction(`BORDER CLICKED: Position (${row}, ${column})`)
      : undefined}
    onEnterBorder={showHitboxes
      ? ({ row, column }) => addAction(`BORDER ENTERED: Position (${row}, ${column})`)
      : undefined}
    onClickCorner={showHitboxes
      ? ({ row, column }) => addAction(`CORNER CLICKED: Position (${row}, ${column})`)
      : undefined}
    onEnterCorner={showHitboxes
      ? ({ row, column }) => addAction(`CORNER ENTERED: Position (${row}, ${column})`)
      : undefined}
    clues={{
      givens: [
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '']
      ],
      extendedcages: [],
      colors: [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null]
      ],
      paths: [
        {
          positions: [
            {
              row: 0,
              column: 1
            },
            {
              row: 0,
              column: 2
            },
            {
              row: 0,
              column: 3
            },
            {
              row: 0,
              column: 4
            },
            {
              row: 0,
              column: 5
            },
            {
              row: 1,
              column: 5
            },
            {
              row: 1,
              column: 6
            },
            {
              row: 1,
              column: 7
            },
            {
              row: 1,
              column: 8
            },
            {
              row: 2,
              column: 8
            },
            {
              row: 3,
              column: 8
            },
            {
              row: 4,
              column: 7
            },
            {
              row: 4,
              column: 6
            },
            {
              row: 5,
              column: 6
            },
            {
              row: 5,
              column: 5
            },
            {
              row: 5,
              column: 4
            },
            {
              row: 4,
              column: 4
            },
            {
              row: 3,
              column: 3
            },
            {
              row: 3,
              column: 2
            },
            {
              row: 3,
              column: 1
            },
            {
              row: 4,
              column: 1
            },
            {
              row: 5,
              column: 0
            },
            {
              row: 6,
              column: 0
            },
            {
              row: 7,
              column: 1
            },
            {
              row: 7,
              column: 2
            },
            {
              row: 8,
              column: 2
            },
            {
              row: 8,
              column: 3
            },
            {
              row: 7,
              column: 3
            },
            {
              row: 6,
              column: 4
            },
            {
              row: 6,
              column: 5
            },
            {
              row: 6,
              column: 6
            },
            {
              row: 6,
              column: 7
            },
            {
              row: 6,
              column: 8
            },
            {
              row: 7,
              column: 8
            },
            {
              row: 7,
              column: 7
            },
            {
              row: 8,
              column: 6
            },
            {
              row: 8,
              column: 7
            }
          ],
          color: 'Black',
          width: 5,
          form: 'Round',
          fill: 'Solid',
          arrow: true
        },
        {
          positions: [
            {
              row: 0,
              column: 2
            },
            {
              row: 0,
              column: 1
            }
          ],
          color: 'Black',
          width: 90,
          form: 'Round',
          fill: 'Hollow',
          arrow: false
        }
      ],
      borderclues: [
        {
          positions: [
            {
              row: 0,
              column: 5
            },
            {
              row: 0,
              column: 4
            }
          ],
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            {
              row: 1,
              column: 6
            },
            {
              row: 1,
              column: 5
            }
          ],
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            {
              row: 2,
              column: 8
            },
            {
              row: 3,
              column: 8
            }
          ],
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            {
              row: 4,
              column: 7
            },
            {
              row: 4,
              column: 6
            }
          ],
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            {
              row: 4,
              column: 4
            },
            {
              row: 5,
              column: 4
            }
          ],
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            {
              row: 3,
              column: 3
            },
            {
              row: 3,
              column: 2
            }
          ],
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            {
              row: 2,
              column: 2
            },
            {
              row: 2,
              column: 1
            }
          ],
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            {
              row: 1,
              column: 7
            },
            {
              row: 2,
              column: 7
            }
          ],
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            {
              row: 3,
              column: 4
            },
            {
              row: 4,
              column: 4
            }
          ],
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            {
              row: 1,
              column: 2
            },
            {
              row: 2,
              column: 2
            }
          ],
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            {
              row: 6,
              column: 1
            },
            {
              row: 6,
              column: 0
            }
          ],
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            {
              row: 7,
              column: 1
            },
            {
              row: 8,
              column: 1
            }
          ],
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            {
              row: 6,
              column: 8
            },
            {
              row: 6,
              column: 7
            }
          ],
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            {
              row: 8,
              column: 8
            },
            {
              row: 8,
              column: 7
            }
          ],
          radius: 20,
          text: 'X'
        }
      ],
      cellclues: [],
      dimensions: {
        rows: 9,
        columns: 9
      },
      cells: [
        [true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true]
      ],
      regions: [
        {
          positions: [
            {
              row: 0,
              column: 0
            },
            {
              row: 1,
              column: 0
            },
            {
              row: 2,
              column: 0
            },
            {
              row: 0,
              column: 1
            },
            {
              row: 1,
              column: 1
            },
            {
              row: 2,
              column: 1
            },
            {
              row: 0,
              column: 2
            },
            {
              row: 1,
              column: 2
            },
            {
              row: 2,
              column: 2
            }
          ],
          type: 'Normal'
        },
        {
          positions: [
            {
              row: 0,
              column: 3
            },
            {
              row: 1,
              column: 3
            },
            {
              row: 2,
              column: 3
            },
            {
              row: 0,
              column: 4
            },
            {
              row: 1,
              column: 4
            },
            {
              row: 2,
              column: 4
            },
            {
              row: 0,
              column: 5
            },
            {
              row: 1,
              column: 5
            },
            {
              row: 2,
              column: 5
            }
          ],
          type: 'Normal'
        },
        {
          positions: [
            {
              row: 0,
              column: 6
            },
            {
              row: 1,
              column: 6
            },
            {
              row: 2,
              column: 6
            },
            {
              row: 0,
              column: 7
            },
            {
              row: 1,
              column: 7
            },
            {
              row: 2,
              column: 7
            },
            {
              row: 0,
              column: 8
            },
            {
              row: 1,
              column: 8
            },
            {
              row: 2,
              column: 8
            }
          ],
          type: 'Normal'
        },
        {
          positions: [
            {
              row: 3,
              column: 0
            },
            {
              row: 4,
              column: 0
            },
            {
              row: 5,
              column: 0
            },
            {
              row: 3,
              column: 1
            },
            {
              row: 4,
              column: 1
            },
            {
              row: 5,
              column: 1
            },
            {
              row: 3,
              column: 2
            },
            {
              row: 4,
              column: 2
            },
            {
              row: 5,
              column: 2
            }
          ],
          type: 'Normal'
        },
        {
          positions: [
            {
              row: 3,
              column: 3
            },
            {
              row: 4,
              column: 3
            },
            {
              row: 5,
              column: 3
            },
            {
              row: 3,
              column: 4
            },
            {
              row: 4,
              column: 4
            },
            {
              row: 5,
              column: 4
            },
            {
              row: 3,
              column: 5
            },
            {
              row: 4,
              column: 5
            },
            {
              row: 5,
              column: 5
            }
          ],
          type: 'Normal'
        },
        {
          positions: [
            {
              row: 3,
              column: 6
            },
            {
              row: 4,
              column: 6
            },
            {
              row: 5,
              column: 6
            },
            {
              row: 3,
              column: 7
            },
            {
              row: 4,
              column: 7
            },
            {
              row: 5,
              column: 7
            },
            {
              row: 3,
              column: 8
            },
            {
              row: 4,
              column: 8
            },
            {
              row: 5,
              column: 8
            }
          ],
          type: 'Normal'
        },
        {
          positions: [
            {
              row: 6,
              column: 0
            },
            {
              row: 7,
              column: 0
            },
            {
              row: 8,
              column: 0
            },
            {
              row: 6,
              column: 1
            },
            {
              row: 7,
              column: 1
            },
            {
              row: 8,
              column: 1
            },
            {
              row: 6,
              column: 2
            },
            {
              row: 7,
              column: 2
            },
            {
              row: 8,
              column: 2
            }
          ],
          type: 'Normal'
        },
        {
          positions: [
            {
              row: 6,
              column: 3
            },
            {
              row: 7,
              column: 3
            },
            {
              row: 8,
              column: 3
            },
            {
              row: 6,
              column: 4
            },
            {
              row: 7,
              column: 4
            },
            {
              row: 8,
              column: 4
            },
            {
              row: 6,
              column: 5
            },
            {
              row: 7,
              column: 5
            },
            {
              row: 8,
              column: 5
            }
          ],
          type: 'Normal'
        },
        {
          positions: [
            {
              row: 6,
              column: 6
            },
            {
              row: 7,
              column: 6
            },
            {
              row: 8,
              column: 6
            },
            {
              row: 6,
              column: 7
            },
            {
              row: 7,
              column: 7
            },
            {
              row: 8,
              column: 7
            },
            {
              row: 6,
              column: 8
            },
            {
              row: 7,
              column: 8
            },
            {
              row: 8,
              column: 8
            }
          ],
          type: 'Normal'
        }
      ],
      logic: {}
    }}
  />

  <div class="flex-1">
    <p>
      Normally all the cell gets hit detected, but in the pen tool, we want to detect corner and
      border hits, and these hitboxes can be seen by checking the below box
    </p>
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={showHitboxes} />
      Show hitboxes
    </label>

    <h2 class="mt-4 font-bold">Actions</h2>
    <div class="border p-2 w-full h-96 overflow-y-auto flex flex-col-reverse justify-end">
      {#each actions as action}
        <p>{action}</p>
      {/each}
    </div>
  </div>
</div>

<style>
  :global(#interface-corner) {
    fill: var(--corner-color);
  }

  :global(#interface-border) {
    fill: var(--border-color);
  }

  :global(#interface-center) {
    fill: var(--center-color);
  }
</style>
