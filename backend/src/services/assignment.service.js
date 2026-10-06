import { env } from '../config/env.js';
import * as repository from '../repositories/request.repository.js';
export const pickStaff = (candidates) => candidates.filter(x => x.activeLoad < env.MAX_ACTIVE_PER_STAFF).sort((a,b) => a.activeLoad-b.activeLoad || new Date(a.lastAssignedAt || 0)-new Date(b.lastAssignedAt || 0) || a.id-b.id)[0] || null;
export const autoAssign = (requestId) => repository.autoAssign(requestId, pickStaff);
