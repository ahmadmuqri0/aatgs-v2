import { redirect, type Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters/zod4';
import { auth } from '#lib/server/auth.ts';
import { loginSchema } from './schema.ts';
import type { PageServerLoad } from './$types';
import { APIError } from 'better-auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) redirect(303, '/');
  return { form: await superValidate(zod(loginSchema)) };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(loginSchema));
    if (!form.valid) return fail(400, { form });

    try {
      await auth.api.signInEmail({ body: form.data });
    } catch (e) {
      if (e instanceof APIError) return message(form, e.message, { status: 400 });
      throw e;
    }

    redirect(303, '/');
  }
} satisfies Actions;
