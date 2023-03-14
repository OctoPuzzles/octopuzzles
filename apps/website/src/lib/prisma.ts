import type { Dimensions } from '@octopuzzles/models';
import { PrismaClient } from '@prisma/client';

const prismaRaw = new PrismaClient();

const prisma = prismaRaw.$extends({
  result: {
    sudoku: {
      dimensions: {
        needs: {
          columns: true,
          rows: true,
          marginTop: true,
          marginRight: true,
          marginBottom: true,
          marginLeft: true
        },
        compute(sudoku) {
          let dimensions: Dimensions = { rows: sudoku.rows, columns: sudoku.columns };
          if (
            sudoku.marginTop != null ||
            sudoku.marginRight != null ||
            sudoku.marginBottom != null ||
            sudoku.marginLeft != null
          ) {
            dimensions = {
              ...dimensions,
              margins: {
                top: sudoku.marginTop ?? 0,
                right: sudoku.marginRight ?? 0,
                bottom: sudoku.marginBottom ?? 0,
                left: sudoku.marginLeft ?? 0
              }
            };
          }
          return dimensions;
        }
      }
    }
  }
});

export default prisma;
