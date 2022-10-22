const mongodb = require('mongodb');
require('dotenv').config();

const mongoClient = new mongodb.MongoClient(process.env.MONGODB_URI);
const database = mongoClient.db('octopuzzles');

const labelCollection = database.collection('labels');
const sudokuCollection = database.collection('sudokus');
const userCollection = database.collection('users');

async function main() {
  console.log('🌱 Seeding database');
  const numUsers = await userCollection.countDocuments();
  if (numUsers > 0) {
    console.log('🌱 Database was already seeded');
    return;
  }
  let date1 = new Date('July 8, 2014 09:10:11');
  let date2 = new Date('January 5, 2022 18:10:18');

  await userCollection.insertMany(
    [
      {
        _id: '62fc78f187990d5e158fb161',
        email: 'admin@octopuzzles.com',
        created_at: date1,
        password:
          '$argon2i$v=19$m=4096,t=3,p=1$SG1zYktiam9jUEQ4QXpCYUNMNE43NVFqY2RIRGpSemlvYjZvVXVRSG5BTGtxQ1pMSlhlUmo4WlJMYWhMSDlYOHpGVjJnWnhQTU5ReWJqZWc3NlpNYzdUWE1LeDZURGVLdVBvUlZDaEhMQ1ZOQWJSV1ZlVVZKdXE5S1JBUkpkYm0$Z6c/06wFEMX443AzFTWn90WYM6dVPKjOLN4UiN9RDYk',
        role: 'Admin',
        updated_at: date1,
        username: 'Admin',
        verified: true
      },
      {
        _id: '62fc78f187990d5e158fb166',
        email: 'dev@octopuzzles.com',
        created_at: date2,
        password:
          '$argon2i$v=19$m=4096,t=3,p=1$SG1zYktiam9jUEQ4QXpCYUNMNE43NVFqY2RIRGpSemlvYjZvVXVRSG5BTGtxQ1pMSlhlUmo4WlJMYWhMSDlYOHpGVjJnWnhQTU5ReWJqZWc3NlpNYzdUWE1LeDZURGVLdVBvUlZDaEhMQ1ZOQWJSV1ZlVVZKdXE5S1JBUkpkYm0$eeOYZj/NBqy2YMv2p8gMH2r5AnlQZNs43KQaC0A6lG4',
        role: 'User',
        updated_at: date2,
        username: 'Dev',
        verified: true
      }
    ],
    {}
  );

  await labelCollection.insertMany([
    {
      _id: '629a24cd969ba0fc6992b8b7',
      name: 'Killer',
      description:
        'Within each cage marked with dotted lines, no digit may repeat and the digits must sum to the number in the top left corner'
    },
    {
      _id: '629a67186f15be1062aededa',
      name: 'Sandwich',
      description:
        'Clues outside the grid inidicate the sum of the digits between 1 and 9 in that row or column'
    },
    {
      _id: '629a691a6f15be1062aededb',
      name: 'Thermo',
      description: 'Digits along a thermometer must strictly increase from bulb to tip'
    },
    {
      _id: '629a69506f15be1062aededc',
      name: 'Irregular',
      description:
        'Fill each row, column and indicated region with the digits 1 to 9 so that no digit appears twice'
    },
    {
      _id: '629a6a0d6f15be1062aededd',
      name: 'Little Killer',
      description:
        'Digits along marked diagonals must sum to the indicated total. Digits can repeat if allowed by other rules'
    },
    {
      _id: '629a6a596f15be1062aedede',
      name: 'Magic Square',
      description:
        'Digits in the indicated region must form a magic square, with each row, column and diagonal summing to the same total'
    },
    {
      _id: '629a6bb06f15be1062aededf',
      name: 'Arrow',
      description: 'Digits along an arrow must sum to the number in the attached circle'
    },
    {
      _id: '629a6bf96f15be1062aedee0',
      name: 'Classic',
      description:
        'Fill each row, column and 3x3 box with the digits 1 to 9 so that no digit appears twice'
    },
    {
      _id: '629a73306f15be1062aedee1',
      name: '6x6',
      description:
        'Fill each row, column and 3x2 box with the digits 1 to 6 so that no digit appears twice'
    },
    {
      _id: '629a738b6f15be1062aedee2',
      name: 'Diagonal',
      description: 'Digits may not repeat along the indicated diagonal'
    },
    {
      _id: '629a73b96f15be1062aedee3',
      name: 'Multi',
      description:
        'Fill each grid like a regular sudoku. The overlaps should fulfill all rules as well.'
    },
    {
      _id: '629a74f86f15be1062aedee4',
      name: 'Anti-King',
      description: 'Diagonally adjacent cells cannot contain the same digit'
    },
    {
      _id: '629a75196f15be1062aedee5',
      name: 'Kropki',
      description:
        'Digits in cells separated by a white dot must be consecutive. Digits separated by a black dot must have a ratio of 2:1'
    },
    {
      _id: '629a757f6f15be1062aedee6',
      name: 'German Whispers',
      description: 'Adjacent digits along a line must differ by at least 5'
    },
    {
      _id: '629a75af6f15be1062aedee7',
      name: 'Renban',
      description:
        'Digits along a line must form a set of consecutive digits in any order, with no repeats'
    },
    {
      _id: '629a760f6f15be1062aedee8',
      name: 'Palindromes',
      description: 'Digits along a line read the same from either direction'
    },
    {
      _id: '629a76626f15be1062aedee9',
      name: 'XV',
      description:
        'Digits in cells separated by an X must sum to 10. Digits in cells separated by a V must sum to 5'
    },
    {
      _id: '629a768a6f15be1062aedeea',
      name: 'Non-consecutive',
      description: 'Orthogonally adjacent cells cannot contain consecutive digits'
    },
    {
      _id: '629a770a6f15be1062aedeeb',
      name: 'Quadruple',
      description:
        'Each digit inside a white circle must appear in at least one of the four surrounding cells'
    },
    {
      _id: '629a77326f15be1062aedeec',
      name: 'Anti-Knights',
      description: "Cells separated by a knight's move (in chess) cannot contain the same digit"
    },
    {
      _id: '629a77b26f15be1062aedeed',
      name: 'Odd/Even',
      description: 'Digits on gray squares must be even, digits on gray circles must be odd'
    },
    {
      _id: '629a78316f15be1062aedeee',
      name: 'Skyscraper',
      description:
        'Assuming each cell is filled with a tower block of the height of its digit, clues outside the grid show how many blocks can be seen from that direction'
    },
    {
      _id: '62a1edadec9dcb7d01cd4b2c',
      name: 'Between Lines',
      description:
        'Digits along a line must be strictly between the numbers in the two connected circles'
    },
    {
      _id: '62a1ede1ec9dcb7d01cd4b2d',
      name: 'X-Sums',
      description:
        'Clues outside of the grid indicate the sum of the first n digits in the indicated row/column, where n is the digit in the first cell seen in that direction'
    },
    {
      _id: '62a1ee0dec9dcb7d01cd4b2e',
      name: 'Min/Max',
      description:
        'Digits in marked cells must be greater than/less than all orthogonally connected cells as indicated'
    },
    {
      _id: '62a1ee1cec9dcb7d01cd4b2f',
      name: 'Disjoint Sets',
      description: 'Digits must appear in different positions in each 3x3 box'
    },
    {
      _id: '62a1ee30ec9dcb7d01cd4b30',
      name: 'Anti-Factor Lines',
      description:
        'Digits along a line of length n may not be any multiple or factor of n other than 1, and must sum to a multiple of n. Digits may repeat on a line if permitted by other rules.'
    },
    {
      _id: '62a1ee47ec9dcb7d01cd4b31',
      name: 'S-Cells',
      description:
        'Fill each row, column and 3x3 box with the digits 0 to 9 so that no digit appears twice. To enable this, there is a single Schrödinger cell in each box, containing two different digits.'
    },
    {
      _id: '62a1ee54ec9dcb7d01cd4b32',
      name: 'Equal Sum Lines',
      description:
        'Digits along a line must sum to the same total in each region the line passes through. Each time a line passes through a region should be considered as a separate total'
    },
    {
      _id: '62a1ee67ec9dcb7d01cd4b33',
      name: ' Lockout Lines',
      description:
        'Digits along a line must not lie between the numbers in the two connected diamonds'
    },
    {
      _id: '62b069206b2453b16ba1ce8b',
      name: 'Inequalities',
      description:
        'Digits in cells separated by an inequality sign should have the indicated relationship'
    },
    {
      _id: '62b06a796b2453b16ba1ce8c',
      name: 'Numbered Rooms',
      description:
        'Digits outside of the grid appear in the nth position in the indicated row/column, where n is the digit in the first cell seen in that direction'
    },
    {
      _id: '62b06bac6b2453b16ba1ce8d',
      name: 'Extra Region',
      description: 'Digits may not repeat in the indicated region'
    },
    {
      _id: '62b06bc16b2453b16ba1ce8e',
      name: 'Clone',
      description: 'The highlighted cells contain identical digits in identical positions'
    },
    {
      _id: '62b06bd16b2453b16ba1ce8f',
      name: '159',
      description:
        'In each row, the digit in column 1 indicates the position of the 1 in that row. Similarly, the positions of 5s and 9s are given by the digits in column 5 and 9 respectively'
    },
    {
      _id: '62b06be76b2453b16ba1ce90',
      name: 'Cycles',
      description:
        "Cells form a horizontal cycle of length n within a row if, by repeatedly jumping to the column indicated by each cell's digit, it takes n jumps to return to the starting position, e.g. C2=4 -> C4=1 -> C1=9 -> C9=2 -> C2=4. A vertical cycle within a column is defined in a similar way"
    },
    {
      _id: '62b06bfa6b2453b16ba1ce91',
      name: 'Chaos Construction',
      description: 'Digits may not repeat in any region; regions are to be determined by the solver'
    }
  ]);

  let date3 = new Date('April 8, 2019 13:13:07');

  await sudokuCollection.insertMany([
    {
      _id: '6287e0af33cf710c1cc89a9c',
      user_id: '62fc78f187990d5e158fb161',
      public_since: date1,
      title: 'Killercage sudoku',
      description:
        'Normal sudoku rules apply: Fill each row, column and marked 3x3 box with the numbers 1 to 9 so that no number appears twice.\n\nKiller cages: Within each box marked with dotted lines, every number has to be unique and sum to the number in the top left corner.',
      points: 0,
      rank: 0,
      dimensions: { rows: 9, columns: 9 },
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
      cornerclues: [
        [
          { nw: '27', ne: '', se: '', sw: '' },
          null,
          null,
          { nw: '4', ne: '', se: '', sw: '' },
          null,
          { nw: '16', ne: '', se: '', sw: '' },
          null,
          { nw: '18', ne: '', se: '', sw: '' },
          { nw: '18', ne: '', se: '', sw: '' }
        ],
        [null, null, { nw: '16', ne: '', se: '', sw: '' }, null, null, null, null, null, null],
        [
          { nw: '8', ne: '', se: '', sw: '' },
          null,
          { nw: '8', ne: '', se: '', sw: '' },
          { nw: '11', ne: '', se: '', sw: '' },
          { nw: '9', ne: '', se: '', sw: '' },
          null,
          { nw: '3', ne: '', se: '', sw: '' },
          null,
          null
        ],
        [
          { nw: '15', ne: '', se: '', sw: '' },
          { nw: '4', ne: '', se: '', sw: '' },
          null,
          null,
          null,
          { nw: '12', ne: '', se: '', sw: '' },
          { nw: '8', ne: '', se: '', sw: '' },
          { nw: '10', ne: '', se: '', sw: '' },
          { nw: '10', ne: '', se: '', sw: '' }
        ],
        [
          null,
          { nw: '19', ne: '', se: '', sw: '' },
          null,
          { nw: '15', ne: '', se: '', sw: '' },
          null,
          null,
          null,
          null,
          null
        ],
        [
          { nw: '7', ne: '', se: '', sw: '' },
          null,
          null,
          null,
          { nw: '19', ne: '', se: '', sw: '' },
          null,
          null,
          { nw: '11', ne: '', se: '', sw: '' },
          { nw: '13', ne: '', se: '', sw: '' }
        ],
        [
          { nw: '18', ne: '', se: '', sw: '' },
          { nw: '21', ne: '', se: '', sw: '' },
          { nw: '19', ne: '', se: '', sw: '' },
          null,
          null,
          null,
          { nw: '17', ne: '', se: '', sw: '' },
          null,
          null
        ],
        [null, null, null, null, null, null, null, { nw: '13', ne: '', se: '', sw: '' }, null],
        [
          null,
          null,
          null,
          null,
          { nw: '15', ne: '', se: '', sw: '' },
          null,
          null,
          null,
          { nw: '3', ne: '', se: '', sw: '' }
        ]
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
      borders: [
        { x1: 0, y1: 0, x2: 1, y2: 0 },
        { x1: 1, y1: 0, x2: 2, y2: 0 },
        { x1: 2, y1: 0, x2: 3, y2: 0 },
        { x1: 3, y1: 0, x2: 4, y2: 0 },
        { x1: 4, y1: 0, x2: 5, y2: 0 },
        { x1: 5, y1: 0, x2: 6, y2: 0 },
        { x1: 6, y1: 0, x2: 7, y2: 0 },
        { x1: 7, y1: 0, x2: 8, y2: 0 },
        { x1: 8, y1: 0, x2: 9, y2: 0 },
        { x1: 0, y1: 3, x2: 1, y2: 3 },
        { x1: 1, y1: 3, x2: 2, y2: 3 },
        { x1: 2, y1: 3, x2: 3, y2: 3 },
        { x1: 3, y1: 3, x2: 4, y2: 3 },
        { x1: 4, y1: 3, x2: 5, y2: 3 },
        { x1: 5, y1: 3, x2: 6, y2: 3 },
        { x1: 6, y1: 3, x2: 7, y2: 3 },
        { x1: 7, y1: 3, x2: 8, y2: 3 },
        { x1: 8, y1: 3, x2: 9, y2: 3 },
        { x1: 0, y1: 6, x2: 1, y2: 6 },
        { x1: 1, y1: 6, x2: 2, y2: 6 },
        { x1: 2, y1: 6, x2: 3, y2: 6 },
        { x1: 3, y1: 6, x2: 4, y2: 6 },
        { x1: 4, y1: 6, x2: 5, y2: 6 },
        { x1: 5, y1: 6, x2: 6, y2: 6 },
        { x1: 6, y1: 6, x2: 7, y2: 6 },
        { x1: 7, y1: 6, x2: 8, y2: 6 },
        { x1: 8, y1: 6, x2: 9, y2: 6 },
        { x1: 0, y1: 9, x2: 1, y2: 9 },
        { x1: 1, y1: 9, x2: 2, y2: 9 },
        { x1: 2, y1: 9, x2: 3, y2: 9 },
        { x1: 3, y1: 9, x2: 4, y2: 9 },
        { x1: 4, y1: 9, x2: 5, y2: 9 },
        { x1: 5, y1: 9, x2: 6, y2: 9 },
        { x1: 6, y1: 9, x2: 7, y2: 9 },
        { x1: 7, y1: 9, x2: 8, y2: 9 },
        { x1: 8, y1: 9, x2: 9, y2: 9 },
        { x1: 0, y1: 0, x2: 0, y2: 1 },
        { x1: 0, y1: 1, x2: 0, y2: 2 },
        { x1: 0, y1: 2, x2: 0, y2: 3 },
        { x1: 0, y1: 3, x2: 0, y2: 4 },
        { x1: 0, y1: 4, x2: 0, y2: 5 },
        { x1: 0, y1: 5, x2: 0, y2: 6 },
        { x1: 0, y1: 6, x2: 0, y2: 7 },
        { x1: 0, y1: 7, x2: 0, y2: 8 },
        { x1: 0, y1: 8, x2: 0, y2: 9 },
        { x1: 3, y1: 0, x2: 3, y2: 1 },
        { x1: 3, y1: 1, x2: 3, y2: 2 },
        { x1: 3, y1: 2, x2: 3, y2: 3 },
        { x1: 3, y1: 3, x2: 3, y2: 4 },
        { x1: 3, y1: 4, x2: 3, y2: 5 },
        { x1: 3, y1: 5, x2: 3, y2: 6 },
        { x1: 3, y1: 6, x2: 3, y2: 7 },
        { x1: 3, y1: 7, x2: 3, y2: 8 },
        { x1: 3, y1: 8, x2: 3, y2: 9 },
        { x1: 6, y1: 0, x2: 6, y2: 1 },
        { x1: 6, y1: 1, x2: 6, y2: 2 },
        { x1: 6, y1: 2, x2: 6, y2: 3 },
        { x1: 6, y1: 3, x2: 6, y2: 4 },
        { x1: 6, y1: 4, x2: 6, y2: 5 },
        { x1: 6, y1: 5, x2: 6, y2: 6 },
        { x1: 6, y1: 6, x2: 6, y2: 7 },
        { x1: 6, y1: 7, x2: 6, y2: 8 },
        { x1: 6, y1: 8, x2: 6, y2: 9 },
        { x1: 9, y1: 0, x2: 9, y2: 1 },
        { x1: 9, y1: 1, x2: 9, y2: 2 },
        { x1: 9, y1: 2, x2: 9, y2: 3 },
        { x1: 9, y1: 3, x2: 9, y2: 4 },
        { x1: 9, y1: 4, x2: 9, y2: 5 },
        { x1: 9, y1: 5, x2: 9, y2: 6 },
        { x1: 9, y1: 6, x2: 9, y2: 7 },
        { x1: 9, y1: 7, x2: 9, y2: 8 },
        { x1: 9, y1: 8, x2: 9, y2: 9 }
      ],
      killercages: [
        [
          { column: 0, row: 0 },
          { column: 0, row: 1 },
          { column: 1, row: 1 },
          { column: 1, row: 0 },
          { column: 2, row: 0 }
        ],
        [
          { column: 3, row: 0 },
          { column: 4, row: 0 }
        ],
        [
          { column: 6, row: 0 },
          { column: 5, row: 0 },
          { column: 5, row: 1 }
        ],
        [
          { column: 6, row: 1 },
          { column: 7, row: 1 },
          { column: 7, row: 0 }
        ],
        [
          { column: 8, row: 0 },
          { column: 8, row: 1 },
          { column: 8, row: 2 }
        ],
        [
          { column: 8, row: 3 },
          { column: 8, row: 4 }
        ],
        [
          { column: 8, row: 5 },
          { column: 8, row: 6 }
        ],
        [
          { column: 8, row: 7 },
          { column: 7, row: 7 },
          { column: 7, row: 8 }
        ],
        [{ column: 8, row: 8 }],
        [
          { column: 7, row: 6 },
          { column: 7, row: 5 }
        ],
        [
          { column: 7, row: 4 },
          { column: 7, row: 3 }
        ],
        [
          { column: 7, row: 2 },
          { column: 6, row: 2 }
        ],
        [{ column: 5, row: 2 }],
        [
          { column: 4, row: 1 },
          { column: 3, row: 1 },
          { column: 2, row: 1 }
        ],
        [
          { column: 0, row: 2 },
          { column: 1, row: 2 }
        ],
        [{ column: 2, row: 2 }],
        [
          { column: 3, row: 2 },
          { column: 3, row: 3 }
        ],
        [
          { column: 4, row: 2 },
          { column: 4, row: 3 },
          { column: 4, row: 4 }
        ],
        [
          { column: 5, row: 3 },
          { column: 5, row: 4 }
        ],
        [
          { column: 6, row: 3 },
          { column: 6, row: 4 }
        ],
        [
          { column: 6, row: 5 },
          { column: 5, row: 5 },
          { column: 4, row: 5 },
          { column: 4, row: 6 }
        ],
        [
          { column: 5, row: 6 },
          { column: 5, row: 7 },
          { column: 4, row: 7 }
        ],
        [
          { column: 6, row: 6 },
          { column: 6, row: 7 }
        ],
        [
          { column: 6, row: 8 },
          { column: 5, row: 8 },
          { column: 4, row: 8 }
        ],
        [
          { column: 2, row: 8 },
          { column: 3, row: 8 },
          { column: 3, row: 7 },
          { column: 3, row: 6 },
          { column: 2, row: 6 }
        ],
        [
          { column: 2, row: 7 },
          { column: 1, row: 7 },
          { column: 1, row: 8 },
          { column: 1, row: 6 }
        ],
        [
          { column: 0, row: 6 },
          { column: 0, row: 7 },
          { column: 0, row: 8 }
        ],
        [
          { column: 0, row: 5 },
          { column: 1, row: 5 }
        ],
        [
          { column: 2, row: 5 },
          { column: 2, row: 4 },
          { column: 1, row: 4 }
        ],
        [
          { column: 3, row: 4 },
          { column: 3, row: 5 }
        ],
        [
          { column: 2, row: 3 },
          { column: 1, row: 3 }
        ],
        [
          { column: 0, row: 3 },
          { column: 0, row: 4 }
        ]
      ],
      paths: [],
      borderclues: [],
      symbols: [
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
      created_at: date1,
      updated_at: date1,
      labels: ['629a24cd969ba0fc6992b8b7'],
      solution: null
    },
    {
      _id: '628bcb11bdf8e35d7801d9db',
      user_id: '62fc78f187990d5e158fb166',
      public_since: date2,
      title: '6x6 sudoku',
      description:
        'Normal 6x6 sudoku rules apply: Fill each row, column and marked 3x2 box with the numbers 1 to 6 so that no number appears twice.',
      points: 1,
      rank: 0.00022238689959279978,
      dimensions: { rows: 6, columns: 6 },
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
      cornerclues: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
      ],
      colors: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
      ],
      borders: [
        { x1: 0, y1: 0, x2: 0, y2: 1 },
        { x1: 6, y1: 0, x2: 6, y2: 1 },
        { x1: 0, y1: 1, x2: 0, y2: 2 },
        { x1: 6, y1: 1, x2: 6, y2: 2 },
        { x1: 0, y1: 2, x2: 0, y2: 3 },
        { x1: 6, y1: 2, x2: 6, y2: 3 },
        { x1: 0, y1: 3, x2: 0, y2: 4 },
        { x1: 6, y1: 3, x2: 6, y2: 4 },
        { x1: 0, y1: 4, x2: 0, y2: 5 },
        { x1: 6, y1: 4, x2: 6, y2: 5 },
        { x1: 0, y1: 5, x2: 0, y2: 6 },
        { x1: 6, y1: 5, x2: 6, y2: 6 },
        { x1: 0, y1: 0, x2: 1, y2: 0 },
        { x1: 0, y1: 6, x2: 1, y2: 6 },
        { x1: 1, y1: 0, x2: 2, y2: 0 },
        { x1: 1, y1: 6, x2: 2, y2: 6 },
        { x1: 2, y1: 0, x2: 3, y2: 0 },
        { x1: 2, y1: 6, x2: 3, y2: 6 },
        { x1: 3, y1: 0, x2: 4, y2: 0 },
        { x1: 3, y1: 6, x2: 4, y2: 6 },
        { x1: 4, y1: 0, x2: 5, y2: 0 },
        { x1: 4, y1: 6, x2: 5, y2: 6 },
        { x1: 5, y1: 0, x2: 6, y2: 0 },
        { x1: 5, y1: 6, x2: 6, y2: 6 },
        { x1: 0, y1: 4, x2: 1, y2: 4 },
        { x1: 1, y1: 4, x2: 2, y2: 4 },
        { x1: 2, y1: 4, x2: 3, y2: 4 },
        { x1: 3, y1: 4, x2: 4, y2: 4 },
        { x1: 4, y1: 4, x2: 5, y2: 4 },
        { x1: 5, y1: 4, x2: 6, y2: 4 },
        { x1: 0, y1: 2, x2: 1, y2: 2 },
        { x1: 1, y1: 2, x2: 2, y2: 2 },
        { x1: 2, y1: 2, x2: 3, y2: 2 },
        { x1: 3, y1: 2, x2: 4, y2: 2 },
        { x1: 4, y1: 2, x2: 5, y2: 2 },
        { x1: 5, y1: 2, x2: 6, y2: 2 },
        { x1: 3, y1: 5, x2: 3, y2: 6 },
        { x1: 3, y1: 4, x2: 3, y2: 5 },
        { x1: 3, y1: 3, x2: 3, y2: 4 },
        { x1: 3, y1: 2, x2: 3, y2: 3 },
        { x1: 3, y1: 1, x2: 3, y2: 2 },
        { x1: 3, y1: 0, x2: 3, y2: 1 }
      ],
      killercages: [],
      paths: [],
      borderclues: [],
      symbols: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
      ],
      created_at: date2,
      updated_at: date2,
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
      labels: ['629a73306f15be1062aedee1']
    },
    {
      _id: '62912c3097364fc894f7552e',
      user_id: '62911f6097364fc894f7552c',
      public_since: date3,
      title: 'Harrowing Journey',
      description:
        'Normal sudoku rules apply.\nDigits along an arrow sum to the number in its attached circle, two digit sums read from left to right.\nCells separated by a V sum to 5 and cells separated by an X sum to 10.',
      points: 1,
      rank: 0.2871745887492588,
      dimensions: { rows: 9, columns: 9 },
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
      cornerclues: [
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
      borders: [
        { x1: 0, y1: 0, x2: 1, y2: 0 },
        { x1: 1, y1: 0, x2: 2, y2: 0 },
        { x1: 2, y1: 0, x2: 3, y2: 0 },
        { x1: 3, y1: 0, x2: 4, y2: 0 },
        { x1: 4, y1: 0, x2: 5, y2: 0 },
        { x1: 5, y1: 0, x2: 6, y2: 0 },
        { x1: 6, y1: 0, x2: 7, y2: 0 },
        { x1: 7, y1: 0, x2: 8, y2: 0 },
        { x1: 8, y1: 0, x2: 9, y2: 0 },
        { x1: 0, y1: 3, x2: 1, y2: 3 },
        { x1: 1, y1: 3, x2: 2, y2: 3 },
        { x1: 2, y1: 3, x2: 3, y2: 3 },
        { x1: 3, y1: 3, x2: 4, y2: 3 },
        { x1: 4, y1: 3, x2: 5, y2: 3 },
        { x1: 5, y1: 3, x2: 6, y2: 3 },
        { x1: 6, y1: 3, x2: 7, y2: 3 },
        { x1: 7, y1: 3, x2: 8, y2: 3 },
        { x1: 8, y1: 3, x2: 9, y2: 3 },
        { x1: 0, y1: 6, x2: 1, y2: 6 },
        { x1: 1, y1: 6, x2: 2, y2: 6 },
        { x1: 2, y1: 6, x2: 3, y2: 6 },
        { x1: 3, y1: 6, x2: 4, y2: 6 },
        { x1: 4, y1: 6, x2: 5, y2: 6 },
        { x1: 5, y1: 6, x2: 6, y2: 6 },
        { x1: 6, y1: 6, x2: 7, y2: 6 },
        { x1: 7, y1: 6, x2: 8, y2: 6 },
        { x1: 8, y1: 6, x2: 9, y2: 6 },
        { x1: 0, y1: 9, x2: 1, y2: 9 },
        { x1: 1, y1: 9, x2: 2, y2: 9 },
        { x1: 2, y1: 9, x2: 3, y2: 9 },
        { x1: 3, y1: 9, x2: 4, y2: 9 },
        { x1: 4, y1: 9, x2: 5, y2: 9 },
        { x1: 5, y1: 9, x2: 6, y2: 9 },
        { x1: 6, y1: 9, x2: 7, y2: 9 },
        { x1: 7, y1: 9, x2: 8, y2: 9 },
        { x1: 8, y1: 9, x2: 9, y2: 9 },
        { x1: 0, y1: 0, x2: 0, y2: 1 },
        { x1: 0, y1: 1, x2: 0, y2: 2 },
        { x1: 0, y1: 2, x2: 0, y2: 3 },
        { x1: 0, y1: 3, x2: 0, y2: 4 },
        { x1: 0, y1: 4, x2: 0, y2: 5 },
        { x1: 0, y1: 5, x2: 0, y2: 6 },
        { x1: 0, y1: 6, x2: 0, y2: 7 },
        { x1: 0, y1: 7, x2: 0, y2: 8 },
        { x1: 0, y1: 8, x2: 0, y2: 9 },
        { x1: 3, y1: 0, x2: 3, y2: 1 },
        { x1: 3, y1: 1, x2: 3, y2: 2 },
        { x1: 3, y1: 2, x2: 3, y2: 3 },
        { x1: 3, y1: 3, x2: 3, y2: 4 },
        { x1: 3, y1: 4, x2: 3, y2: 5 },
        { x1: 3, y1: 5, x2: 3, y2: 6 },
        { x1: 3, y1: 6, x2: 3, y2: 7 },
        { x1: 3, y1: 7, x2: 3, y2: 8 },
        { x1: 3, y1: 8, x2: 3, y2: 9 },
        { x1: 6, y1: 0, x2: 6, y2: 1 },
        { x1: 6, y1: 1, x2: 6, y2: 2 },
        { x1: 6, y1: 2, x2: 6, y2: 3 },
        { x1: 6, y1: 3, x2: 6, y2: 4 },
        { x1: 6, y1: 4, x2: 6, y2: 5 },
        { x1: 6, y1: 5, x2: 6, y2: 6 },
        { x1: 6, y1: 6, x2: 6, y2: 7 },
        { x1: 6, y1: 7, x2: 6, y2: 8 },
        { x1: 6, y1: 8, x2: 6, y2: 9 },
        { x1: 9, y1: 0, x2: 9, y2: 1 },
        { x1: 9, y1: 1, x2: 9, y2: 2 },
        { x1: 9, y1: 2, x2: 9, y2: 3 },
        { x1: 9, y1: 3, x2: 9, y2: 4 },
        { x1: 9, y1: 4, x2: 9, y2: 5 },
        { x1: 9, y1: 5, x2: 9, y2: 6 },
        { x1: 9, y1: 6, x2: 9, y2: 7 },
        { x1: 9, y1: 7, x2: 9, y2: 8 },
        { x1: 9, y1: 8, x2: 9, y2: 9 }
      ],
      killercages: [],
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
          color: null,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 6, row: 1 },
            { column: 5, row: 1 }
          ],
          color: null,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 8, row: 2 },
            { column: 8, row: 3 }
          ],
          color: null,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 7, row: 4 },
            { column: 6, row: 4 }
          ],
          color: null,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 4, row: 4 },
            { column: 4, row: 5 }
          ],
          color: null,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 3, row: 3 },
            { column: 2, row: 3 }
          ],
          color: null,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 2, row: 2 },
            { column: 1, row: 2 }
          ],
          color: null,
          radius: 20,
          text: 'V'
        },
        {
          positions: [
            { column: 7, row: 1 },
            { column: 7, row: 2 }
          ],
          color: null,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 4, row: 3 },
            { column: 4, row: 4 }
          ],
          color: null,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 2, row: 1 },
            { column: 2, row: 2 }
          ],
          color: null,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 1, row: 6 },
            { column: 0, row: 6 }
          ],
          color: null,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 1, row: 7 },
            { column: 1, row: 8 }
          ],
          color: null,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 8, row: 6 },
            { column: 7, row: 6 }
          ],
          color: null,
          radius: 20,
          text: 'X'
        },
        {
          positions: [
            { column: 8, row: 8 },
            { column: 7, row: 8 }
          ],
          color: null,
          radius: 20,
          text: 'X'
        }
      ],
      symbols: [
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
      created_at: date3,
      updated_at: date3,
      labels: []
    }
  ]);
}

main()
  .catch(console.error)
  .finally(() => {
    console.log('🌱 Done seeding database');
    process.exit(1);
  });