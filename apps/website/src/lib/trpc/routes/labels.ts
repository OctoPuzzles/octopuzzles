import { t } from '$lib/trpc/t';

export const labels = t.router({
  getAll: t.procedure.query(async ({ ctx }) => {
    return ctx.prisma.label.findMany();
  })
});
