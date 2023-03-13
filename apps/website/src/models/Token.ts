import { z } from 'zod';

export const TokenValidator = z.object({
  kind: z.enum(['VERIFY_EMAIL']),
  userId: z.number().int(),
  token: z.string()
});

export type Token = z.infer<typeof TokenValidator>;
