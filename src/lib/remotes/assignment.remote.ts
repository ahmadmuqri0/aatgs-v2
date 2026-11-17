import { query } from '$app/server';
import { db } from '#lib/server/db/index.ts';
import { requireUser } from '#lib/server/session.ts';

export const getAssignments = query(async () => {
  const user = requireUser();

  const rows = await db.query.assignment.findMany({
    where: { userId: user.id },
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
});
