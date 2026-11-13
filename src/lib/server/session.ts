import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export function requireSession() {
  const { locals } = getRequestEvent();
  if (!locals.user) error(401, 'Unauthorized');
  return locals.user;
}
