import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';

import { createTRPCHandle } from 'trpc-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = createTRPCHandle({
  router,
  createContext,
  responseMeta: ({ ctx }) => {
    const token = ctx?.event.cookies.get('token');
    const secure = dev ? '' : 'Secure';
    return {
      headers: {
        // TODO: Find a better way to do this
        'set-cookie': `token=${token ?? ''}; SameSite=Lax; Path=/; Max-Age=${
          60 * 60 * 24
        }; HttpOnly; ${secure}`
      }
    };
  }
});
