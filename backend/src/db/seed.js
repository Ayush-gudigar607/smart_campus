import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db, pool } from './index.js';
import { departments, requests, services, users } from './schema/index.js';

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
  // Idempotent reporting fixtures keep averages and date trends useful in a fresh demo database.
  const [it] = await db.select({ id: departments.id }).from(departments).where(eq(departments.name, 'IT')).limit(1);
  const [wifi] = await db.select({ id: services.id }).from(services).where(eq(services.name, 'WiFi issue')).limit(1);
  const fixtureUsers = [
    { name: 'IT Demo Staff', email: 'it.staff.demo@campus.local', passwordHash: await bcrypt.hash('Staff1234', 12), role: 'staff', departmentId: it.id },
    { name: 'Demo Student', email: 'student.demo@campus.local', passwordHash: await bcrypt.hash('Student123', 12), role: 'student', departmentId: it.id, rollNo: 'DEMO2026001', currentYear: 2 },
  ];
  for (const user of fixtureUsers) await db.insert(users).values(user).onConflictDoNothing();
  const [staff] = await db.select({ id: users.id }).from(users).where(eq(users.email, 'it.staff.demo@campus.local')).limit(1);
  const [student] = await db.select({ id: users.id }).from(users).where(eq(users.email, 'student.demo@campus.local')).limit(1);
  const now = Date.now();
  const hoursAgo = (hours) => new Date(now - hours * 60 * 60 * 1000);
  await db.insert(requests).values([
    { requestCode: 'SR-2026-900001', studentId: student.id, serviceId: wifi.id, departmentId: it.id, title: 'Completed WiFi outage', description: 'Demo request resolved in two hours.', priority: 'high', status: 'completed', assignedTo: staff.id, createdAt: hoursAgo(120), assignedAt: hoursAgo(119), completedAt: hoursAgo(118), dueAt: hoursAgo(96), updatedAt: hoursAgo(118) },
    { requestCode: 'SR-2026-900002', studentId: student.id, serviceId: wifi.id, departmentId: it.id, title: 'Completed account issue', description: 'Demo request resolved in four hours.', priority: 'medium', status: 'completed', assignedTo: staff.id, createdAt: hoursAgo(72), assignedAt: hoursAgo(71), completedAt: hoursAgo(68), dueAt: hoursAgo(48), updatedAt: hoursAgo(68) },
    { requestCode: 'SR-2026-900003', studentId: student.id, serviceId: wifi.id, departmentId: it.id, title: 'Open overdue WiFi issue', description: 'Demo overdue request for dashboard.', priority: 'urgent', status: 'assigned', assignedTo: staff.id, createdAt: hoursAgo(36), assignedAt: hoursAgo(35), dueAt: hoursAgo(12), updatedAt: hoursAgo(35) },
  ]).onConflictDoNothing();
} finally {
  await pool.end();
}
