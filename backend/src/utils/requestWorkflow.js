export const TRANSITIONS = { pending: ['assigned', 'cancelled'], assigned: ['in_progress', 'cancelled'], in_progress: ['completed'], completed: [], cancelled: [] };
export const canTransition = (from, to) => TRANSITIONS[from]?.includes(to) ?? false;
export const allowedNext = (from) => TRANSITIONS[from] || [];
