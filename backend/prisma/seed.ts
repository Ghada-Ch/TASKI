import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create 5 users
  const user1 = await prisma.user.create({
    data: {
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      password: 'hashedPassword123',
      role: 'admin',
      job: 'Project Manager',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Fatima Ali',
      email: 'fatima@example.com',
      password: 'hashedPassword456',
      role: 'user',
      job: 'Developer',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Omar Mohamed',
      email: 'omar@example.com',
      password: 'hashedPassword789',
      role: 'user',
      job: 'Designer',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Layla Ibrahim',
      email: 'layla@example.com',
      password: 'hashedPassword101',
      role: 'user',
      job: 'QA Engineer',
    },
  });

  const user5 = await prisma.user.create({
    data: {
      name: 'Karim Nasser',
      email: 'karim@example.com',
      password: 'hashedPassword202',
      role: 'user',
      job: 'Backend Developer',
    },
  });

  console.log('Created 5 users');

  // Create 5 projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      start_date: new Date('2026-01-01'),
      end_date: new Date('2026-03-31'),
      progress: 'In Progress',
      status: 'On Track',
      created_by: user1.id,
      comments: 'Major design update ongoing',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Development of iOS and Android app',
      start_date: new Date('2026-02-01'),
      end_date: new Date('2026-06-30'),
      progress: 'In Progress',
      status: 'On Track',
      created_by: user1.id,
      comments: 'Currently in alpha testing phase',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'API Integration',
      description: 'Integrate third-party payment API',
      start_date: new Date('2026-01-15'),
      end_date: new Date('2026-02-28'),
      progress: 'Completed',
      status: 'Completed',
      created_by: user1.id,
      comments: 'Successfully integrated Stripe API',
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: 'Database Optimization',
      description: 'Optimize database queries for performance',
      start_date: new Date('2026-03-01'),
      end_date: new Date('2026-04-15'),
      progress: 'In Progress',
      status: 'On Track',
      created_by: user1.id,
      comments: 'Working on index optimization',
    },
  });

  const project5 = await prisma.project.create({
    data: {
      name: 'Security Audit',
      description: 'Comprehensive security audit and vulnerability testing',
      start_date: new Date('2026-04-01'),
      end_date: new Date('2026-05-31'),
      progress: 'Not Started',
      status: 'Planned',
      created_by: user1.id,
      comments: 'Scheduled for April',
    },
  });

  console.log('Created 5 projects');

  // Create 5 tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design Homepage Mockup',
      description: 'Create high-fidelity mockup for homepage',
      status: 'In Progress',
      isCompleted: false,
      dueDate: new Date('2026-02-15'),
      comments: 'Waiting for client feedback',
      Priority: 'High',
      createdById: user1.id,
      assignedToId: user3.id,
      projectId: project1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Setup Development Environment',
      description: 'Configure development tools and dependencies',
      status: 'Completed',
      isCompleted: true,
      dueDate: new Date('2026-02-05'),
      comments: 'All tools configured successfully',
      Priority: 'High',
      createdById: user1.id,
      assignedToId: user5.id,
      projectId: project2.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Write Unit Tests',
      description: 'Write comprehensive unit tests for API endpoints',
      status: 'In Progress',
      isCompleted: false,
      dueDate: new Date('2026-03-10'),
      comments: '70% tests completed',
      Priority: 'Medium',
      createdById: user1.id,
      assignedToId: user5.id,
      projectId: project4.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Create Database Schema Documentation',
      description: 'Document all tables and relationships',
      status: 'Not Started',
      isCompleted: false,
      dueDate: new Date('2026-04-20'),
      comments: 'To be started next week',
      Priority: 'Medium',
      createdById: user1.id,
      assignedToId: user2.id,
      projectId: project4.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Security Vulnerability Assessment',
      description: 'Perform comprehensive vulnerability testing',
      status: 'Not Started',
      isCompleted: false,
      dueDate: new Date('2026-05-15'),
      comments: 'Waiting for project kickoff',
      Priority: 'High',
      createdById: user1.id,
      assignedToId: user4.id,
      projectId: project5.id,
    },
  });

  console.log('Created 5 tasks');
  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
