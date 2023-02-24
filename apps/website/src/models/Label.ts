import { z } from 'zod';

export const LabelValidator = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string()
});

export type Label = z.infer<typeof LabelValidator>;
