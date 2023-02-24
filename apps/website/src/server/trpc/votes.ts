import { TRPCError } from '@trpc/server';
import * as trpc from '@trpc/server';
import type { TRPCContext } from '.';
import { intervalToDuration } from 'date-fns';
import { rankingAlgorithm } from '$utils/rankingAlgorithm';
import { VoteValidator, type Vote } from '$models/Vote';

export default trpc.router<TRPCContext>().mutation('vote', {
  input: VoteValidator.pick({ sudokuId: true, value: true }),
  resolve: async ({ input, ctx }): Promise<Vote | null> => {
    // This resolver can, and should, be massively simplified, but maybe the vote architecture should be re-throught anyways
    if (ctx.token == null) {
      throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
    }
    const userId = ctx.token.id;

    const [sudoku, oldVote] = await Promise.all([
      ctx.prisma.sudoku.findUnique({ where: { id: input.sudokuId } }),
      ctx.prisma.vote.findUnique({
        where: { userId_sudokuId: { sudokuId: input.sudokuId, userId } }
      })
    ]);

    if (sudoku == null) {
      throw new TRPCError({
        message: 'We could not find the sudoku you are voting on',
        code: 'BAD_REQUEST'
      });
    }

    const publicSince = sudoku.publicSince;
    if (publicSince == null) {
      throw new TRPCError({
        message: "You can't vote on a sudoku that is not published yet",
        code: 'BAD_REQUEST'
      });
    }

    const durationSinceItWentPublic = intervalToDuration({
      start: publicSince,
      end: new Date()
    });
    if (durationSinceItWentPublic.days == null || durationSinceItWentPublic.days > 100) {
      throw new TRPCError({
        message: 'This sudoku has been archived. You cannot vote on it anymore',
        code: 'BAD_REQUEST'
      });
    }

    if (oldVote == null) {
      // The user has not voted before
      if (input.value === 0) {
        // If voting 0 and there is no vote already, do nothing
        return null;
      }

      const newPoints = sudoku.points + input.value;
      const [vote] = await ctx.prisma.$transaction([
        ctx.prisma.vote.create({ data: { sudokuId: input.sudokuId, userId, value: input.value } }),
        ctx.prisma.sudoku.update({
          where: { id: input.sudokuId },
          data: { points: newPoints, rank: rankingAlgorithm(newPoints, publicSince) }
        })
      ]);

      return vote;
    } else {
      // The user has voted before
      if (input.value === 0) {
        // delete the vote
        const newPoints = sudoku.points - oldVote.value;
        const [vote] = await ctx.prisma.$transaction([
          ctx.prisma.vote.delete({
            where: { userId_sudokuId: { sudokuId: input.sudokuId, userId } }
          }),
          ctx.prisma.sudoku.update({
            where: { id: input.sudokuId },
            data: { points: newPoints, rank: rankingAlgorithm(newPoints, publicSince) }
          })
        ]);
        return vote;
      } else if (input.value === oldVote.value) {
        // The user is voting the same that they did before, don't do anything
        return null;
      } else {
        // The user is changing their vote
        const newPoints = sudoku.points + input.value - oldVote.value;
        const [vote] = await ctx.prisma.$transaction([
          ctx.prisma.vote.update({
            where: { userId_sudokuId: { userId, sudokuId: input.sudokuId } },
            data: { value: input.value }
          }),
          ctx.prisma.sudoku.update({
            where: { id: input.sudokuId },
            data: { points: newPoints, rank: rankingAlgorithm(newPoints, publicSince) }
          })
        ]);
        return vote;
      }
    }
  }
});
