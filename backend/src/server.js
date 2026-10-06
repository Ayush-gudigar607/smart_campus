import app from './app.js';
import { env } from './config/env.js';
import { pool } from './db/index.js';
import { attachSocket } from './realtime/socket.js';
import { startEscalationJob } from './jobs/escalation.job.js';

const server = app.listen(env.PORT, () => console.log(`API listening on port ${env.PORT}`));
attachSocket(server);
startEscalationJob();
const shutdown = () => server.close(() => pool.end().finally(() => process.exit(0)));
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
