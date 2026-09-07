const mongoose = require('mongoose');
const dotenv = require('dotenv');
const JobRole = require('../models/JobRole');

dotenv.config();

const jobRoles = [
  {
    title: 'Full Stack Developer',
    description: 'Builds and maintains both frontend and backend of web applications.',
    requiredSkills: [
      'JavaScript',
      'React',
      'Node.js',
      'Express.js',
      'MongoDB',
      'REST APIs',
      'Git',
    ],
    niceToHaveSkills: ['TypeScript', 'Docker', 'AWS', 'GraphQL'],
  },
  {
    title: 'Frontend Developer',
    description: 'Focuses on building user interfaces and client-side logic.',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Tailwind CSS'],
    niceToHaveSkills: ['TypeScript', 'Next.js', 'Figma'],
  },
  {
    title: 'Backend Developer',
    description: 'Focuses on server-side logic, databases, and APIs.',
    requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
    niceToHaveSkills: ['Docker', 'Redis', 'Microservices'],
  },
];

const seedJobRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await JobRole.deleteMany({});
    console.log('Existing job roles cleared.');

    await JobRole.insertMany(jobRoles);
    console.log('Job roles seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedJobRoles();