import type { Dimensions, Sudoku } from '$models/Sudoku';
import { TRPCError } from '@trpc/server';

export function validateCorrectDimension(
  twoDArray: unknown[][],
  dimensions: Dimensions,
  field: string
): void {
  if (twoDArray.length !== dimensions.rows) {
    throw new TRPCError({
      message: `The number of rows in ${field} differ from the dimensions rows.`,
      code: 'BAD_REQUEST'
    });
  }

  for (const row of twoDArray) {
    if (row.length !== dimensions.columns) {
      throw new TRPCError({
        message: `The number of columns in ${field} differ from the dimensions columns.`,
        code: 'BAD_REQUEST'
      });
    }
  }
}

/**
 * Validates that all the 2D array clues of the sudoku has the correct dimensions as defined by the dimensions on the sudoku
 */
export function validateCorrectDimensionsOfSudokuClues(
  sudoku: Partial<Sudoku> & { dimensions: Sudoku['dimensions'] }
): void {
  for (const [clue, value] of Object.entries(sudoku)) {
    if (Array.isArray(value) && Array.isArray(value[0])) {
      validateCorrectDimension(value as unknown[][], sudoku.dimensions, clue);
    }
  }
}
