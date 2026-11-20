import { EventEmitter } from 'node:events';

export const assignmentEvents = new EventEmitter();

export function notifyAssignmentsChanged(userId: string) {
  assignmentEvents.emit('changed', userId);
}
