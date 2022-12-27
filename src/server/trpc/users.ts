import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import * as argon2 from 'argon2';
import * as trpc from '@trpc/server';
import type { TRPCContext } from '.';
import { sendVerifyUserMail } from '$server/email';
import pick from 'lodash/pick';
import { UserValidator } from '$models/User';
import { setCookie } from '$utils/jwt/setCookie';
import type { Prisma } from '@prisma/client';

export default trpc
  .router<TRPCContext>()
  .mutation('register', {
    input: UserValidator.pick({ username: true, email: true, password: true }),
    resolve: async ({ input, ctx }) => {
      const hashedPassword = await argon2.hash(input.password);

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            password: hashedPassword,
            role: 'User',
            username: input.username,
            verified: false
          }
        });

        const token = crypto.randomUUID();

        sendVerifyUserMail(input.username, input.email, token);

        await ctx.prisma.token.create({ data: { kind: 'VERIFY_EMAIL', token, userId: user.id } });

        return true;
      } catch (e) {
        return false;
      }
    }
  })
  .mutation('login', {
    input: z.object({
      usernameOrEmail: z.string(),
      password: z.string()
    }),
    resolve: async ({ input, ctx }) => {
      const usernameOrEmail = input.usernameOrEmail;
      const filter: Prisma.UserWhereInput = {};
      if (usernameOrEmail.includes('@')) {
        filter.email = usernameOrEmail;
      } else {
        filter.username = usernameOrEmail;
      }
      const user = await ctx.prisma.user.findFirst({ where: filter });

      if (user == null) {
        throw new TRPCError({
          message: 'That username or email does not exist',
          code: 'BAD_REQUEST'
        });
      }

      const passwordIsValid = await argon2.verify(
        user.password,
        input.password /* {
        salt: Buffer.from(ARGON2_SALT)
      } */
      );
      if (!passwordIsValid) {
        throw new TRPCError({
          message: 'Wrong password',
          code: 'BAD_REQUEST'
        });
      }
      if (!user.verified) {
        throw new TRPCError({
          message: `Please verify your account. We have send you an email with a verification link. 
            
            If you didn't get a verification email, you can request a new one at www.octopuzzles.com/resend-verification-email`,
          code: 'BAD_REQUEST'
        });
      }
      setCookie(user, ctx);

      return pick(user, ['id', 'email', 'role', 'username']);
    }
  })
  .mutation('logout', {
    resolve: async ({ ctx }) => {
      ctx.event.cookies.delete('token');

      return;
    }
  })
  .query('me', {
    resolve: async ({ ctx }) => {
      if (!ctx.token) {
        return null;
      }

      const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token.id } });
      if (user) {
        return pick(user, ['id', 'email', 'role', 'username']);
      }

      return null;
    }
  })
  .mutation('verify', {
    input: z.string(), // the token
    resolve: async ({ ctx, input }) => {
      const token = await ctx.prisma.token.delete({ where: { token: input } });
      if (token == null) {
        throw new TRPCError({ message: 'That token has expired', code: 'PRECONDITION_FAILED' });
      }
      const user = await ctx.prisma.user.update({
        where: { id: token.userId },
        data: { verified: true }
      });

      if (user == null) {
        throw new TRPCError({ message: 'Could not find that user', code: 'PRECONDITION_FAILED' });
      }
      setCookie(user, ctx);

      return pick(user, ['id', 'email', 'role', 'username']);
    }
  })
  .mutation('resend-verification', {
    input: z.object({
      email: z.string().email()
    }),
    resolve: async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({ where: { email: input.email } });
      if (user == null) {
        throw new TRPCError({
          message: 'We could not find the user you want to verify',
          code: 'BAD_REQUEST'
        });
      } else if (user.verified) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'The user is already verified' });
      }

      const verificationToken = crypto.randomUUID();

      sendVerifyUserMail(user.username, input.email, verificationToken);

      await ctx.prisma.token.create({
        data: { kind: 'VERIFY_EMAIL', token: verificationToken, userId: user.id }
      });

      return null;
    }
  })
  .query('get', {
    input: z.object({
      id: z.number().int()
    }),
    resolve: async ({ input, ctx }) => {
      return ctx.prisma.user.findUnique({ where: { id: input.id } });
    }
  });
