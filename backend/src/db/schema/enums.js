import { pgEnum } from 'drizzle-orm/pg-core';

export const servicePriorityEnum = pgEnum('service_priority', ['low', 'medium', 'high', 'urgent']);
export const requestStatusEnum = pgEnum('request_status', ['pending', 'assigned', 'in_progress', 'completed', 'cancelled']);
