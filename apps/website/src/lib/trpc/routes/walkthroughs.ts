import { t } from '$lib/trpc/t';
import {
  WalkthroughStepValidator,
  WalkthroughValidator,
  type Walkthrough,
  type Digit
} from '@octopuzzles/models';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const walkthroughs = t.router({
  get: t.procedure
    .input(
      z.object({
        sudokuId: z.number().int()
      })
    )
    .query(async ({ input, ctx }) => {
      const walkthroughRaw = await ctx.prisma.walkthrough.findFirst({
        where: { sudokuId: input.sudokuId }
      });
      const walkthrough: Walkthrough | null =
        walkthroughRaw !== null ? WalkthroughValidator.parse(walkthroughRaw) : null;
      walkthrough?.steps?.forEach((s) => {
        //migrate old style game data
        if (s.step) {
          s.gameData = {
            cellValues: s.step.values.map((row, i) => {
              return row.map((digit, j) => {
                const centermarks = s.step?.centermarks[i][j] ?? '';
                const cornermarks = s.step?.cornermarks[i][j] ?? '';
                const colors = s.step?.colors[i][j] ?? [];
                return {
                  digits: digit !== '' ? [digit as Digit] : undefined,
                  cornermarks:
                    cornermarks !== '' ? cornermarks.split('').map((d) => d as Digit) : undefined,
                  centermarks:
                    centermarks !== '' ? centermarks.split('').map((d) => d as Digit) : undefined,
                  colors: colors.length > 0 ? colors : undefined
                };
              });
            }),
            notes: s.step.notes
          };
          delete s.step;
        }
      });
      return walkthrough;
    }),
  delete: t.procedure
    .input(
      z.object({
        sudokuId: z.number().int()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      const sudoku = await ctx.prisma.sudoku.findUnique({ where: { id: input.sudokuId } });

      if (sudoku == null) {
        throw new TRPCError({ message: 'This sudoku does not exist', code: 'BAD_REQUEST' });
      } else if (sudoku.userId !== ctx.token.id) {
        throw new TRPCError({
          message: 'You can only delete your own walkthroughs',
          code: 'BAD_REQUEST'
        });
      }

      const walkthrough = await ctx.prisma.walkthrough.findFirst({
        where: { sudokuId: input.sudokuId }
      });

      if (walkthrough != null) {
        await ctx.prisma.walkthrough.delete({
          where: { id: walkthrough.id }
        });
      }
    }),
  createOrUpdate: t.procedure
    .input(z.object({ sudokuId: z.number().int(), steps: z.array(WalkthroughStepValidator) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      const sudoku = await ctx.prisma.sudoku.findUnique({ where: { id: input.sudokuId } });

      if (sudoku == null) {
        throw new TRPCError({ message: 'This sudoku does not exist', code: 'BAD_REQUEST' });
      } else if (sudoku.userId !== ctx.token.id) {
        throw new TRPCError({
          message: 'At the moment, only the creators of sudokus are allowed to make walkthroughs',
          code: 'UNAUTHORIZED'
        });
      }

      const walkthrough = await ctx.prisma.walkthrough.upsert({
        where: {
          userId_sudokuId: { sudokuId: input.sudokuId, userId: ctx.token.id }
        },
        update: {
          steps: input.steps
        },
        create: {
          steps: input.steps,
          sudokuId: input.sudokuId,
          userId: ctx.token.id
        }
      });

      return walkthrough;
    })
});
