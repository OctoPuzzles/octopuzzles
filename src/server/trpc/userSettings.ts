import { TRPCError } from '@trpc/server';
import * as trpc from '@trpc/server';
import type { TRPCContext } from '.';
import { UpdateUserSettingsValidator, UserSettingsValidator } from '$models/UserSettings';

export default trpc
	.router<TRPCContext>()
	.query('get', {
		resolve: async ({ ctx }) => {
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
		}
	})
	.mutation('save', {
		input: UpdateUserSettingsValidator,
		resolve: async ({ input, ctx }) => {
			if (ctx.token == null) {
				throw new TRPCError({ message: 'You are not logged in', code: 'UNAUTHORIZED' });
			}
			try {
				await ctx.prisma.userSettings.create({
					data: { userId: ctx.token.id, ...input }
				});
			} catch (e) {
				await ctx.prisma.userSettings.update({
					where: { userId: ctx.token.id },
					data: { userId: ctx.token.id, ...input }
				});
			}
		}
	});
