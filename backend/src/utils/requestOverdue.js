export const isOverdue = (request, now = new Date()) => Boolean(
  request.dueAt && new Date(request.dueAt) < now && !['completed', 'cancelled'].includes(request.status),
);

export const withOverdue = (request, now) => ({ ...request, isOverdue: isOverdue(request, now) });
