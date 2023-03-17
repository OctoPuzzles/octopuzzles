<script lang="ts">
  // import { SudokuDisplay } from '$lib';
</script>

Hello

<!-- <div class="h-screen">
  <SudokuDisplay
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
</div> -->
