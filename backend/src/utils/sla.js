import { SLA_MULTIPLIERS } from '../config/sla.js';
export const dueAtFor = (createdAt, slaHours, priority) => new Date(new Date(createdAt).getTime() + slaHours * SLA_MULTIPLIERS[priority] * 3600000);
