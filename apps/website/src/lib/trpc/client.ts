import type { Router } from '$lib/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';
import superjson from 'superjson';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function trpc(init?: TRPCClientInit) {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient != null) return browserClient;
  const client = createTRPCClient<Router>({ init, transformer: superjson });
  if (isBrowser) browserClient = client;
  return client;
}
