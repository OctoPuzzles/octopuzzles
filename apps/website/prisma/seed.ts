/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const date1 = new Date('July 8, 2014 09:10:11');
const date2 = new Date('January 5, 2022 18:10:18');
const date3 = new Date('April 8, 2019 13:13:07');

const main = async (): Promise<void> => {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'admin@octopuzzles.com',
      createdAt: date1,
      updatedAt: date1,
      password:
        '$argon2i$v=19$m=4096,t=3,p=1$SG1zYktiam9jUEQ4QXpCYUNMNE43NVFqY2RIRGpSemlvYjZvVXVRSG5BTGtxQ1pMSlhlUmo4WlJMYWhMSDlYOHpGVjJnWnhQTU5ReWJqZWc3NlpNYzdUWE1LeDZURGVLdVBvUlZDaEhMQ1ZOQWJSV1ZlVVZKdXE5S1JBUkpkYm0$Z6c/06wFEMX443AzFTWn90WYM6dVPKjOLN4UiN9RDYk',
      role: 'Admin',
      username: 'Admin',
      verified: true
    }
  });
  await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: 'dev@octopuzzles.com',
      createdAt: date2,
      updatedAt: date2,
      password:
        '$argon2i$v=19$m=4096,t=3,p=1$SG1zYktiam9jUEQ4QXpCYUNMNE43NVFqY2RIRGpSemlvYjZvVXVRSG5BTGtxQ1pMSlhlUmo4WlJMYWhMSDlYOHpGVjJnWnhQTU5ReWJqZWc3NlpNYzdUWE1LeDZURGVLdVBvUlZDaEhMQ1ZOQWJSV1ZlVVZKdXE5S1JBUkpkYm0$eeOYZj/NBqy2YMv2p8gMH2r5AnlQZNs43KQaC0A6lG4',
      role: 'User',
      username: 'Dev',
      verified: true
    }
  });

  console.log('🌱 Users seeded');

  await Promise.all(
    [
      {
        id: 1,
        name: 'Killer',
        description:
          'Within each cage marked with dotted lines, no digit may repeat and the digits must sum to the number in the top left corner'
      },
      {
        id: 2,
        name: 'Sandwich',
        description:
          'Clues outside the grid inidicate the sum of the digits between 1 and 9 in that row or column'
      },
      {
        id: 3,
        name: 'Thermo',
        description: 'Digits along a thermometer must strictly increase from bulb to tip'
      },
      {
        id: 4,
        name: 'Irregular',
        description:
          'Fill each row, column and indicated region with the digits 1 to 9 so that no digit appears twice'
      },
      {
        id: 5,
        name: 'Little Killer',
        description:
          'Digits along marked diagonals must sum to the indicated total. Digits can repeat if allowed by other rules'
      },
      {
        id: 6,
        name: 'Magic Square',
        description:
          'Digits in the indicated region must form a magic square, with each row, column and diagonal summing to the same total'
      },
      {
        id: 7,
        name: 'Arrow',
        description: 'Digits along an arrow must sum to the number in the attached circle'
      },
      {
        id: 8,
        name: 'Classic',
        description:
          'Fill each row, column and 3x3 box with the digits 1 to 9 so that no digit appears twice'
      },
      {
        id: 9,
        name: '6x6',
        description:
          'Fill each row, column and 3x2 box with the digits 1 to 6 so that no digit appears twice'
      },
      {
        id: 10,
        name: 'Diagonal',
        description: 'Digits may not repeat along the indicated diagonal'
      },
      {
        id: 11,
        name: 'Multi',
        description:
          'Fill each grid like a regular sudoku. The overlaps should fulfill all rules as well.'
      },
      {
        id: 12,
        name: 'Anti-King',
        description: 'Diagonally adjacent cells cannot contain the same digit'
      },
      {
        id: 13,
        name: 'Kropki',
        description:
          'Digits in cells separated by a white dot must be consecutive. Digits separated by a black dot must have a ratio of 2:1'
      },
      {
        id: 14,
        name: 'German Whispers',
        description: 'Adjacent digits along a line must differ by at least 5'
      },
      {
        id: 15,
        name: 'Renban',
        description:
          'Digits along a line must form a set of consecutive digits in any order, with no repeats'
      },
      {
        id: 16,
        name: 'Palindromes',
        description: 'Digits along a line read the same from either direction'
      },
      {
        id: 17,
        name: 'XV',
        description:
          'Digits in cells separated by an X must sum to 10. Digits in cells separated by a V must sum to 5'
      },
      {
        id: 18,
        name: 'Non-consecutive',
        description: 'Orthogonally adjacent cells cannot contain consecutive digits'
      },
      {
        id: 19,
        name: 'Quadruple',
        description:
          'Each digit inside a white circle must appear in at least one of the four surrounding cells'
      },
      {
        id: 20,
        name: 'Anti-Knights',
        description: "Cells separated by a knight's move (in chess) cannot contain the same digit"
      },
      {
        id: 21,
        name: 'Odd/Even',
        description: 'Digits on gray squares must be even, digits on gray circles must be odd'
      },
      {
        id: 22,
        name: 'Skyscraper',
        description:
          'Assuming each cell is filled with a tower block of the height of its digit, clues outside the grid show how many blocks can be seen from that direction'
      },
      {
        id: 23,
        name: 'Between Lines',
        description:
          'Digits along a line must be strictly between the numbers in the two connected circles'
      },
      {
        id: 24,
        name: 'X-Sums',
        description:
          'Clues outside of the grid indicate the sum of the first n digits in the indicated row/column, where n is the digit in the first cell seen in that direction'
      },
      {
        id: 25,
        name: 'Min/Max',
        description:
          'Digits in marked cells must be greater than/less than all orthogonally connected cells as indicated'
      },
      {
        id: 26,
        name: 'Disjoint Sets',
        description: 'Digits must appear in different positions in each 3x3 box'
      },
      {
        id: 27,
        name: 'Anti-Factor Lines',
        description:
          'Digits along a line of length n may not be any multiple or factor of n other than 1, and must sum to a multiple of n. Digits may repeat on a line if permitted by other rules.'
      },
      {
        id: 28,
        name: 'S-Cells',
        description:
          'Fill each row, column and 3x3 box with the digits 0 to 9 so that no digit appears twice. To enable this, there is a single Schrödinger cell in each box, containing two different digits.'
      },
      {
        id: 29,
        name: 'Region-Sum Lines',
        description:
          'Digits along a line must sum to the same total in each region the line passes through. Each time a line passes through a region should be considered as a separate total'
      },
      {
        id: 30,
        name: 'Lockout Lines',
        description:
          'Digits along a line must not lie between the numbers in the two connected diamonds'
      },
      {
        id: 31,
        name: 'Inequalities',
        description:
          'Digits in cells separated by an inequality sign should have the indicated relationship'
      },
      {
        id: 32,
        name: 'Numbered Rooms',
        description:
          'Digits outside of the grid appear in the nth position in the indicated row/column, where n is the digit in the first cell seen in that direction'
      },
      {
        id: 33,
        name: 'Extra Region',
        description: 'Digits may not repeat in the indicated region'
      },
      {
        id: 34,
        name: 'Clone',
        description: 'The highlighted cells contain identical digits in identical positions'
      },
      {
        id: 35,
        name: '159',
        description:
          'In each row, the digit in column 1 indicates the position of the 1 in that row. Similarly, the positions of 5s and 9s are given by the digits in column 5 and 9 respectively'
      },
      {
        id: 36,
        name: 'Cycles',
        description:
          "Cells form a horizontal cycle of length n within a row if, by repeatedly jumping to the column indicated by each cell's digit, it takes n jumps to return to the starting position, e.g. C2=4 -> C4=1 -> C1=9 -> C9=2 -> C2=4. A vertical cycle within a column is defined in a similar way"
      },
      {
        id: 37,
        name: 'Chaos Construction',
        description:
          'Digits may not repeat in any region; regions are to be determined by the solver'
      },
      {
        id: 38,
        name: 'Product-Sum Lines',
        description:
          'Digits along a line must sum to the product of the digits in the two connected squares'
      },
      {
        id: 39,
        name: 'Entropic Lines',
        description:
          'Every set of 3 consecutive digits along a line must contain one low digit (123), one medium digit (456) and one high digit (789)'
      }
    ].map(async (label) => {
      await prisma.label.upsert({ where: { id: label.id }, update: {}, create: label });
    })
  );
  console.log('🌱 Labels seeded');

  await prisma.sudoku.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: 1,
      publicSince: date1,
      title: 'Basic sudoku',
      description:
        'Normal sudoku rules apply: Fill each row, column and marked 3x3 box with the numbers 1 to 9 so that no number appears twice.',
      points: 0,
      rank: 0,
      difficulty: 4,
      rows: 9,
      columns: 9,
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
      paths: [],
      borderclues: [],
      createdAt: date1,
      updatedAt: date1,
      solution: undefined,
      labels: { connect: { id: 1 } }
    }
  });
  await prisma.sudoku.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: 2,
      publicSince: date2,
      title: '6x6 sudoku',
      description:
        'Normal 6x6 sudoku rules apply: Fill each row, column and marked 3x2 box with the numbers 1 to 6 so that no number appears twice.',
      points: 1,
      rank: 0.00022238689959279978,
      rows: 6,
      columns: 6,
      cells: [
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true]
      ],
      givens: [
        ['3', '', '', '', '', '6'],
        ['', '', '', '4', '', ''],
        ['1', '2', '', '', '6', ''],
        ['6', '4', '', '', '1', ''],
        ['', '', '', '3', '', ''],
        ['5', '', '', '', '', '2']
      ],
      colors: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
      ],
      paths: [],
      borderclues: [],
      createdAt: date2,
      updatedAt: date2,
      solution: {
        numbers: [
          ['3', '5', '4', '1', '2', '6'],
          ['2', '1', '6', '4', '3', '5'],
          ['1', '2', '3', '5', '6', '4'],
          ['6', '4', '5', '2', '1', '3'],
          ['4', '6', '2', '3', '5', '1'],
          ['5', '3', '1', '6', '4', '2']
        ]
      },
      labels: { connect: { id: 9 } }
    }
  });
  await prisma.sudoku.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: 1,
      publicSince: date3,
      title: 'Harrowing Journey',
      description:
        'Normal sudoku rules apply.\nDigits along an arrow sum to the number in its attached circle, two digit sums read from left to right.\nCells separated by a V sum to 5 and cells separated by an X sum to 10.',
      points: 1,
      rank: 0.2871745887492588,
      rows: 9,
      columns: 9,
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
            { column: 1, row: 0 },
            { column: 2, row: 0 },
            { column: 3, row: 0 },
            { column: 4, row: 0 },
            { column: 5, row: 0 },
            { column: 5, row: 1 },
            { column: 6, row: 1 },
            { column: 7, row: 1 },
            { column: 8, row: 1 },
            { column: 8, row: 2 },
            { column: 8, row: 3 },
            { column: 7, row: 4 },
            { column: 6, row: 4 },
            { column: 6, row: 5 },
            { column: 5, row: 5 },
            { column: 4, row: 5 },
            { column: 4, row: 4 },
            { column: 3, row: 3 },
            { column: 2, row: 3 },
            { column: 1, row: 3 },
            { column: 1, row: 4 },
            { column: 0, row: 5 },
            { column: 0, row: 6 },
            { column: 1, row: 7 },
            { column: 2, row: 7 },
            { column: 2, row: 8 },
            { column: 3, row: 8 },
            { column: 3, row: 7 },
            { column: 4, row: 6 },
            { column: 5, row: 6 },
            { column: 6, row: 6 },
            { column: 7, row: 6 },
            { column: 8, row: 6 },
            { column: 8, row: 7 },
            { column: 7, row: 7 },
            { column: 6, row: 8 },
            { column: 7, row: 8 }
          ],
          color: 'Black',
          width: 5,
          form: 'Round',
          fill: 'Solid',
          arrow: true
        },
        {
          positions: [
            { column: 2, row: 0 },
            { column: 1, row: 0 }
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
            { column: 5, row: 0 },
            { column: 4, row: 0 }
          ],
          color: undefined,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 6, row: 1 },
            { column: 5, row: 1 }
          ],
          color: undefined,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 8, row: 2 },
            { column: 8, row: 3 }
          ],
          color: undefined,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 7, row: 4 },
            { column: 6, row: 4 }
          ],
          color: undefined,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 4, row: 4 },
            { column: 4, row: 5 }
          ],
          color: undefined,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 3, row: 3 },
            { column: 2, row: 3 }
          ],
          color: undefined,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 2, row: 2 },
            { column: 1, row: 2 }
          ],
          color: undefined,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 7, row: 1 },
            { column: 7, row: 2 }
          ],
          color: undefined,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 4, row: 3 },
            { column: 4, row: 4 }
          ],
          color: undefined,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 2, row: 1 },
            { column: 2, row: 2 }
          ],
          color: undefined,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 1, row: 6 },
            { column: 0, row: 6 }
          ],
          color: undefined,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 1, row: 7 },
            { column: 1, row: 8 }
          ],
          color: undefined,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 8, row: 6 },
            { column: 7, row: 6 }
          ],
          color: undefined,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 8, row: 8 },
            { column: 7, row: 8 }
          ],
          color: undefined,
          radius: 20,
          text: 'X'
        }
      ],
      createdAt: date3,
      updatedAt: date3
    }
  });
  console.log('🌱 Sudokus seeded');
};
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
