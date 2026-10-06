// Process-local cache is safe for this short dashboard TTL because keys include the
// authenticated role and department. Replace this Map with Redis for multi-instance
// deployments while preserving the same key and 30-second expiry semantics.
const entries = new Map();
export const get = (key) => { const entry = entries.get(key); if (!entry || entry.expiresAt <= Date.now()) { entries.delete(key); return undefined; } return entry.value; };
export const set = (key, value, ttlMs) => entries.set(key, { value, expiresAt: Date.now() + ttlMs });
export const clear = () => entries.clear();
