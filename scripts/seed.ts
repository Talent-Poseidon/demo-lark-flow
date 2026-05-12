const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('adminpassword', 10);

  // Original Admin (preserve existing logic)
  const originalAdmin = await prisma.user.upsert({
    where: { email: 'admin@monster.com' },
    update: {
      password: adminPassword,
      role: 'admin',
      is_approved: true,
    },
    create: {
      email: 'admin@monster.com',
      name: 'Admin Monster',
      password: adminPassword,
      role: 'admin',
      is_approved: true,
    },
  });

  // Test Admin (for E2E tests)
  const testAdmin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password,
      role: 'admin',
      is_approved: true,
    },
    create: {
      email: 'admin@example.com',
      name: 'Test Admin',
      password,
      role: 'admin',
      is_approved: true,
    },
  });

  // Test User (for E2E tests)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      password,
      role: 'user',
      is_approved: true,
    },
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password,
      role: 'user',
      is_approved: true,
    },
  });

  // Seed Kamus for E2E tests
  const seedKamus = await prisma.kamus.upsert({
    where: { id: 'seed-kamus-1' },
    update: {},
    create: {
      id: 'seed-kamus-1',
      templateName: 'Seed Kamus Template',
      fileName: 'seed-template.xlsx',
      status: 'submitted',
    },
  });

  // Seed Standar for E2E tests
  const seedStandar = await prisma.standar.upsert({
    where: { id: 'seed-standar-1' },
    update: {},
    create: {
      id: 'seed-standar-1',
      jobTitle: 'Seed Job Standard',
      description: 'Seed job standard description for E2E tests',
      status: 'submitted',
    },
  });

  // Seed Scenario for E2E tests
  const seedScenario = await prisma.scenario.upsert({
    where: { id: 'seed-scenario-1' },
    update: {},
    create: {
      id: 'seed-scenario-1',
      title: 'Seed Scenario',
      description: 'Seed scenario description for E2E tests',
      status: 'submitted',
    },
  });

  // Seed Project for E2E tests
  const seedProject = await prisma.project.upsert({
    where: { id: 'seed-project-1' },
    update: {},
    create: {
      id: 'seed-project-1',
      name: 'Seed Project Alpha',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      status: 'active',
    },
  });

  // Seed AssessorAssignment for E2E tests
  const seedAssignment = await prisma.assessorAssignment.upsert({
    where: { id: 'seed-assignment-1' },
    update: {},
    create: {
      id: 'seed-assignment-1',
      projectId: 'seed-project-1',
      assessorName: 'Seed Assessor',
      assessorEmail: 'assessor@example.com',
    },
  });

  // Seed Notification for E2E tests
  const seedNotification = await prisma.notification.upsert({
    where: { id: 'seed-notification-1' },
    update: {},
    create: {
      id: 'seed-notification-1',
      projectId: 'seed-project-1',
      assesseeName: 'Seed Assessee',
      assesseeEmail: 'assessee@example.com',
      message: 'You have been added to Seed Project Alpha',
    },
  });

  // Seed DomainEvents for E2E tests
  const seedEventProjectSubmitted = await prisma.domainEvent.upsert({
    where: { id: 'seed-event-1' },
    update: {},
    create: {
      id: 'seed-event-1',
      type: 'PROJECT_SUBMITTED',
      entityId: 'seed-project-1',
      payload: JSON.stringify({ name: 'Seed Project Alpha', startDate: '2026-01-01', endDate: '2026-12-31' }),
    },
  });

  const seedEventAssessorAssigned = await prisma.domainEvent.upsert({
    where: { id: 'seed-event-2' },
    update: {},
    create: {
      id: 'seed-event-2',
      type: 'ASSESSOR_ASSIGNED',
      entityId: 'seed-assignment-1',
      payload: JSON.stringify({ projectId: 'seed-project-1', assessorName: 'Seed Assessor', assessorEmail: 'assessor@example.com' }),
    },
  });

  const seedEventAssesseeNotified = await prisma.domainEvent.upsert({
    where: { id: 'seed-event-3' },
    update: {},
    create: {
      id: 'seed-event-3',
      type: 'ASSESSEE_NOTIFIED',
      entityId: 'seed-notification-1',
      payload: JSON.stringify({ projectId: 'seed-project-1', assesseeName: 'Seed Assessee', assesseeEmail: 'assessee@example.com', message: 'You have been added to Seed Project Alpha' }),
    },
  });

  console.log({ originalAdmin, testAdmin, testUser, seedKamus, seedStandar, seedScenario, seedProject, seedAssignment, seedNotification, seedEventProjectSubmitted, seedEventAssessorAssigned, seedEventAssesseeNotified });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
