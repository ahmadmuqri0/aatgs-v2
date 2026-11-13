import { auth } from '#lib/server/auth.ts';
import { form, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const logout = form(async () => {
  const { request } = getRequestEvent();
  await auth.api.signOut({ headers: request.headers });
  redirect(303, '/login');
});
