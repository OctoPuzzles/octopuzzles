import { TRPCError } from '@trpc/server';
import * as trpc from '@trpc/server';
import type { TRPCContext } from '.';
import { z } from 'zod';
import { SavedGameValidator, type SavedGame } from '$models/SavedGame';

export default trpc
	.router<TRPCContext>()
	.mutation('createOrUpdate', {
		input: SavedGameValidator.pick({ gameData: true, sudokuId: true }),
		resolve: async ({ input, ctx }) => {
			if (ctx.token == null) {
				throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
			}
			const sudoku = await ctx.prisma.sudoku.findUnique({ where: { id: input.sudokuId } });

			if (sudoku == null) {
				throw new TRPCError({ message: 'This sudoku does not exist', code: 'BAD_REQUEST' });
			}

			const savedGame = await ctx.prisma.savedGame.upsert({
				where: {
					uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id }
				},
				update: {
					gameData: input.gameData
				},
				create: {
					sudokuId: input.sudokuId,
					userId: ctx.token.id,
					gameData: input.gameData
				}
			});

			return savedGame;
		}
	})
	.query('get', {
		input: z.object({
			sudokuId: z.number().int()
		}),
		resolve: async ({ input, ctx }) => {
			if (ctx.token != null) {
				const savedGameRaw = await ctx.prisma.savedGame.findFirst({
					where: { userId: ctx.token.id, sudokuId: input.sudokuId }
				});
				const savedGame: SavedGame | null =
					savedGameRaw !== null ? SavedGameValidator.parse(savedGameRaw) : null;
				return savedGame;
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
			const savedGame = await ctx.prisma.savedGame.findUnique({
				where: { uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id } }
			});
			if (savedGame == null) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'We could not find the saved game you are trying to delete'
				});
			}

			return ctx.prisma.savedGame.delete({
				where: { uniqueKey: { sudokuId: input.sudokuId, userId: ctx.token.id } }
			});
		}
	});
