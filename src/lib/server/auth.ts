import { ORIGIN, BETTER_AUTH_SECRET } from '$app/env/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '#lib/server/db/index.ts';
import * as schema from '#lib/server/db/schema/index.ts';

export const auth = betterAuth({
  baseURL: ORIGIN,
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { schema, provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  plugins: [sveltekitCookies(getRequestEvent)]
});
