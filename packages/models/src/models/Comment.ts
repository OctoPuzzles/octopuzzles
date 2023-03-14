import { z } from 'zod';

export const CommentValidator = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  sudokuId: z.number().int(),
  body: z.string().max(1024),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Comment = z.infer<typeof CommentValidator>;
