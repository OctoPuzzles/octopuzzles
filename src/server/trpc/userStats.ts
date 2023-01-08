import { TRPCError } from '@trpc/server';
import * as trpc from '@trpc/server';
import type { TRPCContext } from '.';
import { z } from 'zod';
import { UserStatsValidator, type UserStats } from '$models/UserStats';

export default trpc
  .router<TRPCContext>()
  .mutation('viewed', {
    input: UserStatsValidator.pick({ sudokuId: true }),
    resolve: async ({ input, ctx }) => {
      if (ctx.token == null) return;

      const sudoku = await ctx.prisma.sudoku.findUnique({ where: { id: input.sudokuId } });

      if (sudoku == null) {
        throw new TRPCError({ message: 'This sudoku does not exist', code: 'BAD_REQUEST' });
      }

      const userStats = await ctx.prisma.userStats.upsert({
        where: {
          uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id }
        },
        update: {
          lastViewedOn: new Date()
        },
        create: {
          sudokuId: input.sudokuId,
          userId: ctx.token.id,
          lastViewedOn: new Date()
        }
      });

      return userStats;
    }
  })
  .mutation('solved', {
    input: UserStatsValidator.pick({ sudokuId: true, solveTime: true }),
    resolve: async ({ input, ctx }) => {
      if (ctx.token == null) return;

      const userStatsRaw = await ctx.prisma.userStats.findUnique({
        where: { uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id } }
      });
      if (userStatsRaw == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'We could not find the stats object you are trying to update'
        });
      }

      return ctx.prisma.userStats.update({
        where: { uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id } },
        data: { solvedOn: new Date(), solveTime: input.solveTime }
      });
    }
  })
  .mutation('bookmarked', {
    input: z.object({ sudokuId: z.number().int() }),
    resolve: async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      const userStatsRaw = await ctx.prisma.userStats.findUnique({
        where: { uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id } }
      });
      if (userStatsRaw == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'We could not find the stats object you are trying to update'
        });
      }

      return ctx.prisma.userStats.update({
        where: { uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id } },
        data: { bookmarked: UserStatsValidator.parse(userStatsRaw).bookmarked ?? false }
      });
    }
  })
  .query('get', {
    input: z.object({
      sudokuId: z.number().int()
    }),
    resolve: async ({ input, ctx }) => {
      if (ctx.token != null) {
        const userStatsRaw = await ctx.prisma.userStats.findFirst({
          where: { userId: ctx.token.id, sudokuId: input.sudokuId }
        });
        const userStats: UserStats | null =
          userStatsRaw !== null ? UserStatsValidator.parse(userStatsRaw) : null;
        return userStats;
      }
      return null;
    }
  })
  .mutation('delete', {
    input: z.object({ sudokuId: z.number().int() }),
    resolve: async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      const userStats = await ctx.prisma.userStats.findUnique({
        where: { uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id } }
      });
      if (userStats == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'We could not find the stats object you are trying to delete'
        });
      }

      return ctx.prisma.userStats.delete({
        where: { uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id } }
      });
    }
  });
