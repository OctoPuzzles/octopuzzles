import { t } from '$lib/trpc/t';
import { UpdateUserSettingsValidator, UserSettingsValidator } from '@octopuzzles/models';
import { TRPCError } from '@trpc/server';

export const userSettings = t.router({
  get: t.procedure.query(async ({ ctx }) => {
    if (ctx.token != null) {
      const settingsRaw = await ctx.prisma.userSettings.findUnique({
        where: { userId: ctx.token.id }
      });
      if (settingsRaw != null) {
        const settings = UserSettingsValidator.parse(settingsRaw);
        if (settings != null) {
          return settings;
        }
      }
    }

    return null;
  }),
  save: t.procedure.input(UpdateUserSettingsValidator).mutation(async ({ input, ctx }) => {
    if (ctx.token == null) {
      throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
    }
    await ctx.prisma.userSettings.upsert({
      where: { userId: ctx.token.id },
      create: {
        userId: ctx.token.id,
        ...input,
        scanner: input.scanner ?? undefined
      },
      update: {
        userId: ctx.token.id,
        ...input,
        scanner: input.scanner ?? undefined
      }
    });
  })
});
