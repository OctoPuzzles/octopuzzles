import { t } from '$lib/trpc/t';
import {
  validateCorrectDimension,
  validateCorrectDimensionsOfSudokuClues
} from '$utils/validation';
import {
  FrontendUserValidator,
  LabelValidator,
  NewSudokuValidator,
  SolutionValidator,
  SudokuValidator,
  UpdateSudokuValidator
} from '@octopuzzles/models';
import type { Sudoku } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import range from 'lodash/range';
import { z } from 'zod';

export const sudokus = t.router({
  search: t.procedure
    .input(
      z.object({
        query: z.string().optional(),
        difficultyRange: z
          .tuple([z.number().int().min(0).max(5), z.number().int().min(0).max(5)])
          .optional(),
        labels: z.array(z.number().int()),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.date().optional(),
        userId: z.number().int().optional()
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 24;
      const [lowerRange, upperRange] =
        input.difficultyRange == null ? [0, 5] : input.difficultyRange.sort();

      const orFilter: any[] = [];
      if (lowerRange === 0) {
        orFilter.push({ difficulty: null });
      }
      orFilter.push({ difficulty: { in: range(lowerRange, upperRange + 1) } });

      const rawSudokus = await ctx.prisma.sudoku.findMany({
        where: {
          AND: {
            // Only get published sudokus, unless it is the users own puzzle
            publicSince:
              ctx.token != null && input.userId === ctx.token.id
                ? { lt: input.cursor }
                : { not: null, lt: input.cursor },
            title:
              input.query != null && input.query !== ''
                ? {
                    contains: input.query,
                    mode: 'insensitive'
                  }
                : undefined,
            userId: input.userId,
            labels: input.labels.length > 0 ? { some: { id: { in: input.labels } } } : undefined
          },
          OR: orFilter
        },
        include: {
          labels: true,
          user: {
            select: {
              id: true,
              username: true,
              role: true
            }
          }
        },
        orderBy: { publicSince: 'desc' },
        take: limit + 1
      });

      const sudokus = z
        .array(
          SudokuValidator.extend({
            labels: z.array(LabelValidator),
            user: FrontendUserValidator
          })
        )
        .parse(rawSudokus);

      let nextCursor: typeof input.cursor | null = null;
      if (sudokus.length > limit) {
        const nextItem = sudokus.pop();
        nextCursor = nextItem?.publicSince ?? null;
      }

      return { sudokus, nextCursor };
    }),
  get: t.procedure
    .input(
      z.object({
        id: z.number().int()
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.token?.id;
      const sudokuRaw = await ctx.prisma.sudoku.findUnique({
        where: { id: input.id },
        include: {
          user: { select: { id: true, username: true, role: true } },
          labels: true
        }
      });
      if (sudokuRaw == null) return null;

      const sudoku = SudokuValidator.extend({
        user: FrontendUserValidator,
        labels: z.array(LabelValidator)
      }).parse(sudokuRaw);

      const userVote =
        sudoku != null && userId != null
          ? await ctx.prisma.vote.findUnique({
              where: { userId_sudokuId: { sudokuId: sudoku?.id, userId } }
            })
          : null;

      const userStats =
        sudoku != null && userId != null
          ? await ctx.prisma.userStats.findUnique({
              where: { uniqueKey: { sudokuId: sudoku?.id, userId } }
            })
          : null;

      return sudoku != null ? { ...sudoku, userVote, userStats } : null;
    }),
  delete: t.procedure
    .input(
      z.object({
        id: z.number().int()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      const sudoku = await ctx.prisma.sudoku.findUnique({ where: { id: input.id } });
      if (sudoku?.userId !== ctx.token.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You can only delete your own sudokus'
        });
      }
      await ctx.prisma.$transaction([
        ctx.prisma.sudoku.delete({ where: { id: input.id } }),
        ctx.prisma.vote.deleteMany({ where: { sudokuId: sudoku?.id } })
      ]);

      return sudoku;
    }),
  changePublicStatus: t.procedure
    .input(
      z.object({
        id: z.number().int(),
        public: z.boolean()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      // First check if the user has permission to update the sudoku.
      const sudoku = await ctx.prisma.sudoku.findUnique({ where: { id: input.id } });
      if (sudoku == null) {
        throw new TRPCError({
          message: 'We could not find the sudoku you are trying to update',
          code: 'BAD_REQUEST'
        });
      } else if (sudoku.userId !== ctx.token.id) {
        throw new TRPCError({
          message: 'You are not allowed to edit this sudoku',
          code: 'UNAUTHORIZED'
        });
      }

      let shouldDeleteVotes = false;
      const newSudoku: Pick<Sudoku, 'points' | 'rank' | 'publicSince'> = {
        points: 0,
        rank: 0,
        publicSince: null
      };

      if (input.public && sudoku.publicSince == null) {
        // The user wants to make the sudoku public
        newSudoku.publicSince = new Date();
      } else if (!input.public && sudoku.publicSince != null) {
        // User wants to take the sudoku out of public status
        shouldDeleteVotes = true;
        newSudoku.publicSince = null;
      } else {
        // The user is not really changing the public status, just return what it already is
        return input.public;
      }

      await ctx.prisma.$transaction(async (tx) => {
        await tx.sudoku.update({ where: { id: input.id }, data: newSudoku });

        if (shouldDeleteVotes) {
          await tx.vote.deleteMany({ where: { sudokuId: sudoku.id } });
        }
      });

      return input.public;
    }),
  provideSolutionToPuzzle: t.procedure
    .input(
      z.object({
        sudokuId: z.number().int(),
        solution: SolutionValidator.optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      // First check if the user has permission to make a solution for the sudoku.
      const sudoku = await ctx.prisma.sudoku.findUnique({ where: { id: input.sudokuId } });
      if (sudoku == null) {
        throw new TRPCError({
          message: 'We could not find the sudoku you are trying to update',
          code: 'BAD_REQUEST'
        });
      } else if (sudoku.userId == null || sudoku.userId !== ctx.token.id) {
        throw new TRPCError({
          message: 'You are not allowed to provide a solution to this sudoku',
          code: 'BAD_REQUEST'
        });
      }

      if (input.solution == null) {
        // delete solution from sudoku
        const updatedSudoku = await ctx.prisma.sudoku.update({
          where: { id: input.sudokuId },
          data: { solution: undefined }
        });

        return updatedSudoku;
      } else {
        // Add solution to puzzle
        validateCorrectDimension(input.solution.numbers, sudoku.dimensions, 'solution');

        const updatedSudoku = await ctx.prisma.sudoku.update({
          where: { id: input.sudokuId },
          data: { solution: input.solution }
        });

        return updatedSudoku;
      }
    }),
  create: t.procedure
    .input(
      z.object({
        sudoku: NewSudokuValidator,
        labels: z.array(z.number().int()).optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      validateCorrectDimensionsOfSudokuClues(input.sudoku);

      if (input.labels != null) {
        const labelsCount = await ctx.prisma.label.count({
          where: { id: { in: input.labels } }
        });
        if (labelsCount !== input.labels.length) {
          throw new TRPCError({
            message: 'One of the specified labels does not exist',
            code: 'BAD_REQUEST'
          });
        }
      }

      const { dimensions, ...sudokuInput } = input.sudoku;
      const newSudoku = await ctx.prisma.sudoku.create({
        data: {
          ...sudokuInput,
          rows: dimensions.rows,
          columns: dimensions.columns,
          marginTop: dimensions.margins?.top,
          marginRight: dimensions.margins?.right,
          marginBottom: dimensions.margins?.bottom,
          marginLeft: dimensions.margins?.left,
          cells: sudokuInput.cells ?? undefined,
          givens: sudokuInput.givens ?? undefined,
          colors: sudokuInput.colors ?? undefined,
          regions: sudokuInput.regions ?? undefined,
          extendedcages: sudokuInput.extendedcages ?? undefined,
          paths: sudokuInput.paths ?? undefined,
          borderclues: sudokuInput.borderclues ?? undefined,
          cellclues: sudokuInput.cellclues ?? undefined,
          logic: sudokuInput.logic ?? undefined,
          userId: ctx.token.id,
          rank: 0,
          points: 0,
          labels: { connect: input.labels?.map((l) => ({ id: l })) ?? [] }
        }
      });

      return newSudoku;
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.number().int(),
        sudokuUpdates: UpdateSudokuValidator,
        labels: z.array(z.number().int()).optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.token == null) {
        throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
      }
      // First check if the user has permission to update the sudoku.
      const oldSudoku = await ctx.prisma.sudoku.findUnique({ where: { id: input.id } });
      if (oldSudoku == null) {
        throw new TRPCError({
          message: 'We could not find the sudoku you are trying to update',
          code: 'BAD_REQUEST'
        });
      } else if (oldSudoku.userId == null || oldSudoku.userId !== ctx.token.id) {
        throw new TRPCError({
          message: 'You are not allowed to edit this sudoku',
          code: 'BAD_REQUEST'
        });
      }
      validateCorrectDimensionsOfSudokuClues({
        ...input.sudokuUpdates,
        dimensions: input.sudokuUpdates.dimensions ?? oldSudoku.dimensions
      });

      if (input.labels != null) {
        const labelsCount = await ctx.prisma.label.count({
          where: { id: { in: input.labels } }
        });
        if (labelsCount !== input.labels.length) {
          throw new TRPCError({
            message: 'One of the specified labels does not exist',
            code: 'BAD_REQUEST'
          });
        }
      }
      // User has permission to edit the sudoku

      const { dimensions, ...sudokuInput } = input.sudokuUpdates;
      const updatedSudoku = await ctx.prisma.sudoku.update({
        where: { id: input.id },
        data: {
          ...sudokuInput,
          rows: dimensions?.rows,
          columns: dimensions?.columns,
          marginTop: dimensions?.margins?.top,
          marginRight: dimensions?.margins?.right,
          marginBottom: dimensions?.margins?.bottom,
          marginLeft: dimensions?.margins?.left,
          cells: sudokuInput.cells ?? undefined,
          givens: sudokuInput.givens ?? undefined,
          colors: sudokuInput.colors ?? undefined,
          regions: sudokuInput.regions ?? undefined,
          extendedcages: sudokuInput.extendedcages ?? undefined,
          paths: sudokuInput.paths ?? undefined,
          borderclues: sudokuInput.borderclues ?? undefined,
          cellclues: sudokuInput.cellclues ?? undefined,
          logic: sudokuInput.logic ?? undefined,
          userId: ctx.token.id,
          rank: 0,
          points: 0,
          labels: { connect: input.labels?.map((l) => ({ id: l })) ?? [] }
        }
      });

      return updatedSudoku;
    })
});
