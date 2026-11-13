import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters/zod4';
import { registerSchema } from './schema';
import { auth } from '#lib/server/auth.ts';
import { APIError } from 'better-auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) redirect(303, '/');
  return { form: await superValidate(zod(registerSchema)), title: 'Register' };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(registerSchema));
    if (!form.valid) return fail(400, { form });

    try {
      await auth.api.signUpEmail({ body: form.data });
    } catch (e) {
      if (e instanceof APIError) return message(form, e.message, { status: 400 });
      throw e;
    }
    redirect(303, '/');
  }
} satisfies Actions;
