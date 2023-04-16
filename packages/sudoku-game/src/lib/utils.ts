import type { Position } from '@octopuzzles/models';
import { arrayfrom0ToN } from '@octopuzzles/utils';

/**
 * Checks if the new line starts inside the old line. This means the new line is meant for deletion
 */
export const startsInsideOtherLine = (newLine: Position[], oldLine: Position[]): boolean => {
  if (newLine.length < 2 || oldLine.length < 2) return false;
  const firstPointInNewLine = newLine[0];
  const indexOfFirstPointInOldLine = oldLine.findIndex(
    (p) => p.row === firstPointInNewLine.row && p.column === firstPointInNewLine.column
  );
  if (indexOfFirstPointInOldLine === -1) return false;

  const secondPointInNewLine = newLine[1];
  const indexOfSecondPointInOldLine = oldLine.findIndex(
    (p) => p.row === secondPointInNewLine.row && p.column === secondPointInNewLine.column
  );

  if (indexOfSecondPointInOldLine === -1) return false;

  return Math.abs(indexOfFirstPointInOldLine - indexOfSecondPointInOldLine) === 1;
};

/**
 * Splits the old line into lines not overlapped by the new one. Overlaps have to be more than one position
 */
export const splitLineOnOverlap = (
  overlappingLine: Position[],
  oldLine: Position[]
): Position[][] => {
  // List of indexes of the old line where the new line is overlapping
  const overlappingIndexes: number[] = [];
  oldLine.forEach((position, index) => {
    if (overlappingLine.some((p) => p.row === position.row && p.column === position.column)) {
      overlappingIndexes.push(index);
    }
  });

  const finalOverlappingPositions: number[] = [];
  for (const i of overlappingIndexes) {
    if (overlappingIndexes.includes(i - 1) || overlappingIndexes.includes(i + 1)) {
      finalOverlappingPositions.push(i);
      continue;
    }
  }
  if (finalOverlappingPositions.length === oldLine.length) return [];

  const newLines: Position[][] = [];
  let tempLine: Position[] = [];
  arrayfrom0ToN(oldLine.length).forEach((i) => {
    if (!finalOverlappingPositions.includes(i) || !finalOverlappingPositions.includes(i + 1)) {
      tempLine.push(oldLine[i]);
    } else if (i !== 0 && i !== oldLine.length - 1 && !finalOverlappingPositions.includes(i - 1)) {
      tempLine.push(oldLine[i]);
      newLines.push(tempLine);
      tempLine = [];
    }
  });

  if (tempLine.length > 1) {
    newLines.push(tempLine);
  }

  return newLines;
};

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;
  describe('startsInsideOtherLine', () => {
    it('Works', () => {
      expect(
        startsInsideOtherLine(
          [
            { row: 0, column: 0 },
            { row: 0, column: 1 }
          ],
          [
            { row: 1, column: 0 },
            { row: 0, column: 0 },
            { row: 0, column: 1 }
          ]
        )
      ).toBeTruthy();
    });

    it('Does not return true if the new line only has one position', () => {
      expect(
        startsInsideOtherLine(
          [{ row: 0, column: 0 }],
          [
            { row: 1, column: 0 },
            { row: 0, column: 0 },
            { row: 0, column: 1 }
          ]
        )
      ).toBeFalsy();
    });

    it('Does not return true if the old line only has one position', () => {
      expect(
        startsInsideOtherLine(
          [
            { row: 0, column: 0 },
            { row: 0, column: 1 }
          ],
          [{ row: 0, column: 0 }]
        )
      ).toBeFalsy();
    });

    it("Does not return true if they don't overlap at all", () => {
      expect(
        startsInsideOtherLine(
          [
            { row: 0, column: 0 },
            { row: 0, column: 1 }
          ],
          [
            { row: 9, column: 9 },
            { row: 9, column: 8 },
            { row: 9, column: 7 }
          ]
        )
      ).toBeFalsy();
    });

    it('Does not return true if the new line overlaps, but only in one position', () => {
      expect(
        startsInsideOtherLine(
          [
            { row: 0, column: 0 },
            { row: 0, column: 1 },
            { row: 0, column: 2 }
          ],
          [
            { row: 0, column: 0 },
            { row: 1, column: 0 },
            { row: 2, column: 0 }
          ]
        )
      ).toBeFalsy();
    });
  });

  describe('splitLineOnOverlap', () => {
    it('Returns the whole line if the new lines does not overlap', () => {
      expect(
        splitLineOnOverlap(
          [
            { row: 0, column: 0 },
            { row: 1, column: 0 }
          ],
          [
            { row: 0, column: 5 },
            { row: 1, column: 5 }
          ]
        )
      ).toStrictEqual([
        [
          { row: 0, column: 5 },
          { row: 1, column: 5 }
        ]
      ]);
    });

    it('Returns an empty string if they two lines completely overlap', () => {
      expect(
        splitLineOnOverlap(
          [
            { row: 0, column: 0 },
            { row: 1, column: 0 },
            { row: 2, column: 0 }
          ],
          [
            { row: 0, column: 0 },
            { row: 1, column: 0 }
          ]
        )
      ).toStrictEqual([]);
    });

    it('Returns a correctly split up string', () => {
      const splitLines = splitLineOnOverlap(
        [
          { row: 0, column: 0 },
          { row: 1, column: 0 },
          { row: 1, column: 1 },
          { row: 2, column: 1 },
          { row: 3, column: 1 },
          { row: 4, column: 1 },
          { row: 4, column: 0 },
          { row: 5, column: 0 },
          { row: 6, column: 0 },
          { row: 6, column: 1 },
          { row: 1, column: 1 },
          { row: 8, column: 1 },
          { row: 9, column: 1 },
          { row: 9, column: 0 }
        ],
        [
          { row: 0, column: 0 },
          { row: 1, column: 0 },
          { row: 2, column: 0 },
          { row: 3, column: 0 },
          { row: 4, column: 0 },
          { row: 5, column: 0 },
          { row: 6, column: 0 },
          { row: 7, column: 0 },
          { row: 8, column: 0 },
          { row: 9, column: 0 }
        ]
      );

      expect(splitLines).toStrictEqual([
        [
          { row: 1, column: 0 },
          { row: 2, column: 0 },
          { row: 3, column: 0 },
          { row: 4, column: 0 }
        ],
        [
          { row: 6, column: 0 },
          { row: 7, column: 0 },
          { row: 8, column: 0 },
          { row: 9, column: 0 }
        ]
      ]);
    });

    it('It does not leave dots', () => {
      const splitLines = splitLineOnOverlap(
        [
          {
            row: 2.5,
            column: 4.5
          },
          {
            row: 3.5,
            column: 4.5
          },
          {
            row: 4.5,
            column: 4.5
          }
        ],
        [
          {
            row: 2.5,
            column: 3.5
          },
          {
            row: 2.5,
            column: 4.5
          },
          {
            row: 3.5,
            column: 4.5
          },
          {
            row: 4.5,
            column: 4.5
          }
        ]
      );

      expect(splitLines).toStrictEqual([
        [
          {
            row: 2.5,
            column: 3.5
          },
          {
            row: 2.5,
            column: 4.5
          }
        ]
      ]);
    });

    it('Works on this example', () => {
      const newLines = splitLineOnOverlap(
        [
          {
            row: 2.5,
            column: 3.5
          },
          {
            row: 3.5,
            column: 3.5
          },
          {
            row: 3.5,
            column: 4.5
          }
        ],
        [
          {
            row: 1.5,
            column: 3.5
          },
          {
            row: 2.5,
            column: 3.5
          },
          {
            row: 3.5,
            column: 3.5
          },
          {
            row: 4.5,
            column: 3.5
          },
          {
            row: 5.5,
            column: 3.5
          },
          {
            row: 6.5,
            column: 3.5
          },
          {
            row: 7.5,
            column: 3.5
          }
        ]
      );
      expect(newLines).toStrictEqual([
        [
          {
            row: 1.5,
            column: 3.5
          },
          {
            row: 2.5,
            column: 3.5
          }
        ],
        [
          {
            row: 3.5,
            column: 3.5
          },
          {
            row: 4.5,
            column: 3.5
          },
          {
            row: 5.5,
            column: 3.5
          },
          {
            row: 6.5,
            column: 3.5
          },
          {
            row: 7.5,
            column: 3.5
          }
        ]
      ]);
    });
  });
}
