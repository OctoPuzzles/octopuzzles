import * as trpc from '@trpc/server';
import type { TRPCContext } from '.';

export default trpc.router<TRPCContext>().query('getAll', {
  resolve: async ({ ctx }) => {
    return ctx.prisma.label.findMany();
  }
});
