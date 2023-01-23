import type { Annotation } from '$models/Sudoku';
import {
	WalkthroughStepValidator,
	WalkthroughValidator,
	type Walkthrough
} from '$models/Walkthrough';
import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import type { TRPCContext } from '.';

export default trpc
	.router<TRPCContext>()
	.query('get', {
		input: z.object({
			sudokuId: z.number().int()
		}),
		resolve: async ({ input, ctx }) => {
			const walkthroughRaw = await ctx.prisma.walkthrough.findFirst({
				where: { sudokuId: input.sudokuId }
			});
			const walkthrough: Walkthrough | null =
				walkthroughRaw !== null ? WalkthroughValidator.parse(walkthroughRaw) : null;
			walkthrough?.steps?.forEach((s) => {
				//migrate old style game data
				if (s.step) {
					const annotations: Annotation[] = [];
					s.gameData = {
						cellValues: s.step.values.map((row, i) => {
							return row.map((digit, j) => {
								const centermarks = s.step?.centermarks[i][j] ?? '';
								const cornermarks = s.step?.cornermarks[i][j] ?? '';
								const colors = s.step?.colors[i][j] ?? [];
								const note = s.step?.notes[i][j] ?? '';
								if (note !== '') {
									annotations.push({
										positions: [{ row: i, column: j }],
										type: 'Note',
										details: note
									});
								}
								return {
									digits: digit !== '' ? [digit] : undefined,
									cornermarks: cornermarks !== '' ? cornermarks.split('') : undefined,
									centermarks: centermarks !== '' ? centermarks.split('') : undefined,
									colors: colors.length > 0 ? colors : undefined
								};
							});
						}),
						annotations
					};
					delete s.step;
				}
			});
			return walkthrough;
		}
	})
	.mutation('delete', {
		input: z.object({
			sudokuId: z.number().int()
		}),
		resolve: async ({ input, ctx }) => {
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
		}
	})
	.mutation('createOrUpdate', {
		input: z.object({ sudokuId: z.number().int(), steps: z.array(WalkthroughStepValidator) }),
		resolve: async ({ input, ctx }) => {
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
		}
	});
