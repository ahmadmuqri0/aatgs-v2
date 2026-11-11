import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export function sessionUser() {
  const { locals } = getRequestEvent();
  if (!locals.user) error(401, 'Unauthorized');
  return locals.user;
}
