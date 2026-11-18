import { auth } from '#lib/server/auth.ts';
import { loginSchema, registerSchema } from '#lib/schemas/auth.ts';
import { form, getRequestEvent } from '$app/server';
import { invalid, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth';

export const login = form(loginSchema, async (data) => {
  try {
    await auth.api.signInEmail({ body: data });
  } catch (e) {
    if (e instanceof APIError) invalid(e.message);
    throw e;
  }

  redirect(303, '/');
});

export const register = form(registerSchema, async (data) => {
  try {
    await auth.api.signUpEmail({ body: data });
  } catch (e) {
    if (e instanceof APIError) invalid(e.message);
    throw e;
  }

  redirect(303, '/');
});

export const logout = form(async () => {
  const { request } = getRequestEvent();
  await auth.api.signOut({ headers: request.headers });
  redirect(303, '/login');
});
