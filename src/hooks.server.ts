import { sequence, type Handle, type ServerInit } from '@sveltejs/kit/hooks';
import { building } from '$app/env';
import { auth } from '#lib/server/auth.ts';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { redirect } from '@sveltejs/kit';
import { db } from './lib/server/db';
import { generation } from '#lib/server/db/schema/assignment.schema.ts';
import { eq } from 'drizzle-orm';

export const init: ServerInit = async () => {
  await db
    .update(generation)
    .set({ status: 'failed', error: 'Interrupted by server restart' })
    .where(eq(generation.status, 'pending'));
};

const handleAuthGuard: Handle = ({ event, resolve }) => {
  if (event.route.id?.startsWith('/(app)') && !event.locals.user) {
    redirect(303, '/login');
  }
  return resolve(event);
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({ headers: event.request.headers });

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleBetterAuth, handleAuthGuard);
