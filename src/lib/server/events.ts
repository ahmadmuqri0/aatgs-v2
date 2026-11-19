import { EventEmitter } from 'node:events';

// in-process pub/sub for pushing assignment changes to live queries (single local process)
export const assignmentEvents = new EventEmitter();

export function notifyAssignmentsChanged(userId: string) {
  assignmentEvents.emit('changed', userId);
}
