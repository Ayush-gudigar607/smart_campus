import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db, pool } from './index.js';
import { departments, services, users } from './schema/index.js';

// These names are the public values accepted by the registration API.
const departmentData = [
  ...['CSE', 'AIML', 'AIDS', 'CSBS', 'CSDS', 'ECE', 'EEE', 'MECH', 'AUTOMOBILE', 'AERONAUTICAL', 'MARINE'].map((name) => ({ name })),
  { name: 'Hostel', description: 'Hostel administration and resident support' }, { name: 'IT', description: 'Campus technology support' }, { name: 'Library', description: 'Library services' }, { name: 'Maintenance', description: 'Campus facilities maintenance' }, { name: 'Academics', description: 'Academic records and certificates' },
];
const serviceData = { Hostel: [['Room repair', 24], ['Mess complaint', 12]], IT: [['WiFi issue', 8], ['Account reset', 4]], Library: [['Book request', 72], ['Fine waiver', 48]], Maintenance: [['Electrical repair', 12], ['Plumbing repair', 24]], Academics: [['Bonafide certificate', 48], ['Marksheet copy', 72]] };
const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase() || 'admin@campus.local';
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin12345';

try {
  for (const department of departmentData) {
    const existing = await db.select({ id: departments.id }).from(departments).where(eq(departments.name, department.name)).limit(1);
    if (!existing.length) await db.insert(departments).values(department);
  }
  for (const [departmentName, catalog] of Object.entries(serviceData)) {
    const [department] = await db.select({ id: departments.id }).from(departments).where(eq(departments.name, departmentName)).limit(1);
    for (const [name, slaHours] of catalog) {
      const existing = await db.select({ id: services.id }).from(services).where(eq(services.name, name)).limit(1);
      if (!existing.length) await db.insert(services).values({ name, departmentId: department.id, slaHours });
    }
  }
  const existingAdmin = await db.select({ id: users.id }).from(users).where(eq(users.email, adminEmail)).limit(1);
  if (!existingAdmin.length) {
    await db.insert(users).values({ name: 'Campus Administrator', email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 12), role: 'admin' });
    console.log(`Created admin: ${adminEmail}`);
    if (!process.env.SEED_ADMIN_PASSWORD) console.log('Default seed password: Admin12345 (change it immediately).');
  } else console.log(`Admin already exists: ${adminEmail}`);
} finally {
  await pool.end();
}
