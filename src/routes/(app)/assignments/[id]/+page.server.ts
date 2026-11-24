import { error } from '@sveltejs/kit';

import { db } from '#lib/server/db/index.ts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const row = await db.query.assignment.findFirst({
    where: { id: params.id, userId: locals.user!.id },
    columns: { title: true }
  });
  if (!row) error(404, 'Assignment not found');

  return {
    title: row.title,
    breadcrumbs: [{ label: 'Assignments', href: '/assignments' as const }, { label: row.title }]
  };
};
