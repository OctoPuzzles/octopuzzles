import { t } from '$lib/trpc/t';
import { UserStatsValidator, type UserStats } from '@octopuzzles/models';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const userStats = t.router({
  viewed: t.procedure
    .input(UserStatsValidator.pick({ sudokuId: true }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) return;

      const userId = ctx.token.id;

      const [sudoku, oldStats] = await Promise.all([
        ctx.prisma.sudoku.findUnique({ where: { id: input.sudokuId } }),
        ctx.prisma.userStats.findUnique({
          where: { uniqueKey: { sudokuId: input.sudokuId, userId } }
        })
      ]);

      if (sudoku == null) {
        throw new TRPCError({ message: 'This sudoku does not exist', code: 'BAD_REQUEST' });
      }

      if (oldStats == null) {
        const newViews = sudoku.views + 1;
        const [userStats] = await ctx.prisma.$transaction([
          ctx.prisma.userStats.create({
            data: {
              sudokuId: input.sudokuId,
              userId,
              lastViewedOn: new Date()
            }
          }),
          ctx.prisma.sudoku.update({
            where: { id: input.sudokuId },
            data: { views: newViews }
          })
        ]);

        return userStats;
      } else {
        return ctx.prisma.userStats.update({
          where: {
            uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id }
          },
          data: {
            lastViewedOn: new Date()
          }
        });
      }
    }),
  solved: t.procedure
    .input(UserStatsValidator.pick({ sudokuId: true, solveTime: true }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) return;

      const userId = ctx.token.id;

      const [sudoku, oldStats] = await Promise.all([
        ctx.prisma.sudoku.findUnique({ where: { id: input.sudokuId } }),
        ctx.prisma.userStats.findUnique({
          where: { uniqueKey: { sudokuId: input.sudokuId, userId } }
        })
      ]);

      if (oldStats == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'We could not find the stats object you are trying to update'
        });
      }

      const logSolve = ctx.prisma.userStats.update({
        where: { uniqueKey: { sudokuId: input.sudokuId, userId } },
        data: { solvedOn: new Date(), solveTime: input.solveTime }
      });

      if (oldStats.solvedOn == null) {
        const newSolves = (sudoku?.solves ?? 0) + 1;
        const [userStats] = await ctx.prisma.$transaction([
          logSolve,
          ctx.prisma.sudoku.update({
            where: { id: input.sudokuId },
            data: { solves: newSolves }
          })
        ]);

        return userStats;
      } else {
        return logSolve;
      }
    }),
  setDifficulty: t.procedure
    .input(UserStatsValidator.pick({ sudokuId: true, difficulty: true }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) return;

      const userId = ctx.token.id;

      const [oldStats, summary] = await Promise.all([
        ctx.prisma.userStats.findUnique({
          where: { uniqueKey: { sudokuId: input.sudokuId, userId } }
        }),
        ctx.prisma.userStats.aggregate({
          _sum: { difficulty: true },
          _count: { difficulty: true },
          where: { sudokuId: input.sudokuId }
        })
      ]);

      if (oldStats == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'We could not find the stats object you are trying to update'
        });
      }

      let difficultyTotal = summary?._sum.difficulty ?? 0;
      let difficultyCount = summary?._count.difficulty ?? 0;
      if (oldStats.difficulty == null) {
        if (input.difficulty == null) {
          return null;
        } else {
          difficultyCount += 1;
        }
      } else {
        difficultyTotal -= oldStats.difficulty;
        if (input.difficulty == null) {
          difficultyCount -= 1;
        }
      }
      difficultyTotal += input.difficulty ?? 0;

      const newUserDifficulty =
        difficultyCount > 0 ? Math.round((2 * difficultyTotal) / difficultyCount) / 2 : null;
      const [userStats] = await ctx.prisma.$transaction([
        ctx.prisma.userStats.update({
          where: { uniqueKey: { sudokuId: input.sudokuId, userId } },
          data: { difficulty: input.difficulty }
        }),
        ctx.prisma.sudoku.update({
          where: { id: input.sudokuId },
          data: { userDifficulty: newUserDifficulty }
        })
      ]);

      return userStats;
    }),
  get: t.procedure
    .input(
      z.object({
        sudokuId: z.number().int()
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.token != null) {
        const userId = ctx.token.id;

        const userStatsRaw = await ctx.prisma.userStats.findFirst({
          where: { userId, sudokuId: input.sudokuId }
        });
        const userStats: UserStats | null =
          userStatsRaw != null ? UserStatsValidator.parse(userStatsRaw) : null;
        return userStats;
      }
      return null;
    }),
  delete: t.procedure
    .input(z.object({ sudokuId: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }

      const userId = ctx.token.id;

      const [userStats, summary] = await Promise.all([
        ctx.prisma.userStats.findUnique({
          where: { uniqueKey: { sudokuId: input.sudokuId, userId } }
        }),
        ctx.prisma.userStats.aggregate({
          _sum: { difficulty: true },
          _count: { lastViewedOn: true, solvedOn: true, difficulty: true },
          where: { sudokuId: input.sudokuId }
        })
      ]);

      if (userStats == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'We could not find the stats object you are trying to delete'
        });
      }

      let difficultyTotal = summary?._sum.difficulty ?? 0;
      let difficultyCount = summary?._count.difficulty ?? 0;
      if (userStats.difficulty != null) {
        difficultyTotal -= userStats.difficulty;
        difficultyCount -= 1;
      }

      const newViews = summary._count.lastViewedOn - 1;
      const newSolves = summary._count.solvedOn - (userStats.solvedOn != null ? 1 : 0);
      const newUserDifficulty =
        difficultyCount > 0 ? Math.round((2 * difficultyTotal) / difficultyCount) / 2 : null;

      return ctx.prisma.$transaction([
        ctx.prisma.userStats.delete({
          where: { uniqueKey: { sudokuId: input.sudokuId, userId } }
        }),
        ctx.prisma.sudoku.update({
          where: { id: input.sudokuId },
          data: { views: newViews, solves: newSolves, userDifficulty: newUserDifficulty }
        })
      ]);
    })
});
