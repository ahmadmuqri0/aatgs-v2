import { UPLOAD_DIR } from '$app/env/private';
import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { db } from '#lib/server/db/index.ts';
import { requireUser } from '#lib/server/session.ts';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const user = requireUser();

  const row = await db.query.assignment.findFirst({
    where: { id: params.id, userId: user.id },
    columns: { fileKey: true, fileName: true, fileMimeType: true }
  });
  if (!row) error(404, 'Assignment not found');

  const file = await readFile(path.join(UPLOAD_DIR, row.fileKey)).catch(() => null);
  if (!file) error(404, 'Brief file not found');

  return new Response(file, {
    headers: {
      'Content-Type': row.fileMimeType,
      'Content-Length': String(file.byteLength),
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(row.fileName)}`,
      'Cache-Control': 'private, no-store'
    }
  });
};
