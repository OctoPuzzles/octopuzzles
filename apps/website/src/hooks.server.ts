import { createContext, router } from './server/trpc';
import { createTRPCHandle } from 'trpc-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
  // Do anything you want here
  const response = await createTRPCHandle({
    router,
    createContext,
    responseMeta: ({ ctx }) => {
      const token = ctx?.event.cookies.get('token');
      const secure = dev ? '' : 'Secure';
      return {
        headers: {
          'set-cookie': `token=${token ?? ''}; SameSite=Lax; Path=/; Max-Age=${
            60 * 60 * 24
          }; HttpOnly; ${secure}`
        }
      };
    },
    event,
    resolve
  });

  return response;
};
