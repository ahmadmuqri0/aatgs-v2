import { UPLOAD_DIR } from '$app/env/private';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters/zod4';
import { createAssignmentSchema } from './schema';
import type { Actions } from '@sveltejs/kit';
import { db } from '#lib/server/db/index.ts';
import { assignment } from '#lib/server/db/schema/assignment.schema.js';
import path from 'node:path';
import { requireUser } from '#lib/server/session.ts';

export const load: PageServerLoad = async () => {
  return { form: await superValidate(zod(createAssignmentSchema)), title: 'Assignments' };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(createAssignmentSchema));

    if (!form.valid) return fail(400, { form });

    const id = crypto.randomUUID();
    const fileKey = `${id}.pdf`;
    const filePath = path.join(UPLOAD_DIR, fileKey);
    const user = requireUser();

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(filePath, new Uint8Array(await form.data.brief.arrayBuffer()));

    try {
      await db.insert(assignment).values({
        id,
        userId: user.id,
        title: form.data.title,
        dueDate: form.data.dueDate ? new Date(`${form.data.dueDate}T00:00:00`) : null,
        fileName: form.data.brief.name,
        fileKey,
        fileSize: form.data.brief.size,
        fileMimeType: form.data.brief.type
      });
    } catch (error) {
      await rm(filePath, { force: true });
      throw error;
    }
  }
} satisfies Actions;
