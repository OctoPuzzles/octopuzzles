import { TRPCError } from '@trpc/server';
import * as trpc from '@trpc/server';
import type { TRPCContext } from '.';
import { CommentValidator } from '$models/Comment';
import { z } from 'zod';

export default trpc
  .router<TRPCContext>()
  .mutation('create', {
    input: CommentValidator.pick({ body: true, sudokuId: true }),
    resolve: async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      const userId = ctx.token.id;
      return ctx.prisma.comment.create({
        data: { body: input.body, userId, sudokuId: input.sudokuId }
      });
    }
  })
  .query('onSudoku', {
    input: z.object({
      sudokuId: z.number().int(),
      limit: z.number().min(1).max(100).optional(),
      cursor: z.date().optional()
    }),
    resolve: async ({ input, ctx }) => {
      const limit = input.limit ?? 24;
      const comments = await ctx.prisma.comment.findMany({
        where: {
          sudokuId: input.sudokuId,
          createdAt: input.cursor != null ? { lt: input.cursor } : undefined
        },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, username: true } } },
        take: limit + 1
      });

      let nextCursor: typeof input.cursor | null = null;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.createdAt ?? null;
      }

      return { comments, nextCursor };
    }
  })
  .mutation('delete', {
    input: z.object({ id: z.number().int() }),
    resolve: async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      const comment = await ctx.prisma.comment.findUnique({ where: { id: input.id } });
      if (comment == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'We could not find the comment you are trying to delete'
        });
      }

      if (comment.userId !== ctx.token.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You can only delete your own comments'
        });
      }

      return ctx.prisma.comment.delete({ where: { id: input.id } });
    }
  })
  .mutation('update', {
    input: CommentValidator.pick({ body: true, id: true }),
    resolve: async ({ input, ctx }) => {
      const comment = await ctx.prisma.comment.findUnique({ where: { id: input.id } });
      if (comment == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'We could not find the comment you are trying to update'
        });
      } else if (comment.userId !== ctx.token?.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You have to be logged in to update a comment'
        });
      }

      return ctx.prisma.comment.update({ where: { id: input.id }, data: { body: input.body } });
    }
  });
