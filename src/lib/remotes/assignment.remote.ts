import { UPLOAD_DIR } from '$app/env/private';
import { form, query } from '$app/server';
import { on } from 'node:events';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { createAssignmentSchema } from '#lib/schemas/assignment.ts';
import { db } from '#lib/server/db/index.ts';
import { assignment } from '#lib/server/db/schema/index.ts';
import { assignmentEvents, notifyAssignmentsChanged } from '#lib/server/events.ts';
import { startGeneration } from '#lib/server/generation.ts';
import { requireUser } from '#lib/server/session.ts';

async function loadAssignments(userId: string) {
  const rows = await db.query.assignment.findMany({
    where: { userId },
    columns: { id: true, title: true, dueDate: true, fileName: true },
    orderBy: (t, { sql, desc }) => [sql`${t.dueDate} asc nulls last`, desc(t.createdAt)],
    with: {
      activeGeneration: {
        columns: { id: true },
        with: { tasks: { columns: { completedAt: true } } }
      },
      generations: {
        columns: { status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        limit: 1
      }
    }
  });

  return rows.map(({ activeGeneration, generations, ...assignment }) => ({
    ...assignment,
    latestStatus: generations[0]?.status ?? null,
    progress: activeGeneration
      ? {
          completed: activeGeneration.tasks.filter((t) => t.completedAt).length,
          total: activeGeneration.tasks.length
        }
      : null
  }));
}

export const getAssignments = query.live(async function* () {
  const user = requireUser();
  yield await loadAssignments(user.id);

  for await (const [userId] of on(assignmentEvents, 'changed')) {
    if (userId === user.id) yield await loadAssignments(user.id);
  }
});

export const createAssignment = form(createAssignmentSchema, async (data) => {
  const user = requireUser();
  const id = crypto.randomUUID();
  const fileKey = `${id}.pdf`;
  const filePath = path.join(UPLOAD_DIR, fileKey);

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(filePath, new Uint8Array(await data.brief.arrayBuffer()));

  try {
    await db.insert(assignment).values({
      id,
      userId: user.id,
      title: data.title,
      dueDate: data.dueDate ? new Date(`${data.dueDate}T00:00:00`) : null,
      fileName: data.brief.name,
      fileKey,
      fileSize: data.brief.size,
      fileMimeType: data.brief.type
    });
  } catch (e) {
    await rm(filePath, { force: true });
    throw e;
  }

  await startGeneration(id);
  notifyAssignmentsChanged(user.id);
});
