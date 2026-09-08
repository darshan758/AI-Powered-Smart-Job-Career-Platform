const mongoose = require('mongoose');
const dotenv = require('dotenv');
const JobRole = require('../models/JobRole');

dotenv.config();

const jobRoles = [
  {
    title: 'Full Stack Developer',
    description: 'Builds and maintains both frontend and backend of web applications.',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git', 'Testing'],
    niceToHaveSkills: ['TypeScript', 'Next.js', 'Docker', 'AWS', 'GraphQL', 'Redis', 'CI/CD'],
  },
  {
    title: 'Frontend Developer',
    description: 'Focuses on building user interfaces and client-side logic.',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Responsive Design', 'Web Accessibility', 'Git', 'Testing'],
    niceToHaveSkills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Figma', 'Redux', 'Playwright', 'Performance Optimization'],
  },
  {
    title: 'Backend Developer',
    description: 'Focuses on server-side logic, databases, and APIs.',
    requiredSkills: ['Node.js', 'Express.js', 'JavaScript', 'REST APIs', 'Authentication', 'MongoDB', 'SQL', 'Git', 'Testing'],
    niceToHaveSkills: ['TypeScript', 'Docker', 'Redis', 'Microservices', 'GraphQL', 'Message Queues', 'CI/CD'],
  },
  {
    title: 'Java Developer',
    description: 'Builds enterprise applications and backend services using Java and its ecosystem.',
    requiredSkills: ['Java', 'Spring Boot', 'Object-Oriented Programming', 'SQL', 'REST APIs', 'Data Structures', 'Git', 'Unit Testing'],
    niceToHaveSkills: ['Hibernate', 'Microservices', 'Kafka', 'Docker', 'JUnit', 'Maven', 'AWS'],
  },
  {
    title: 'Python Developer',
    description: 'Builds backend services, scripts, and applications using Python.',
    requiredSkills: ['Python', 'Object-Oriented Programming', 'SQL', 'REST APIs', 'Git', 'Data Structures', 'Testing'],
    niceToHaveSkills: ['Django', 'Flask', 'FastAPI', 'Docker', 'Celery', 'PostgreSQL', 'AWS'],
  },
  {
    title: 'DevOps Engineer',
    description: 'Automates infrastructure, deployment pipelines, and system reliability.',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Bash Scripting', 'Networking', 'Cloud Platforms'],
    niceToHaveSkills: ['Terraform', 'AWS', 'Jenkins', 'Ansible', 'Prometheus', 'Grafana', 'Python', 'Security Best Practices'],
  },
  {
    title: 'Cloud Engineer',
    description: 'Designs, deploys, and manages cloud infrastructure and services.',
    requiredSkills: ['AWS', 'Linux', 'Networking', 'Terraform', 'Docker', 'Cloud Security', 'Monitoring', 'Git'],
    niceToHaveSkills: ['Azure', 'GCP', 'Kubernetes', 'CloudFormation', 'Serverless', 'Python', 'Cost Optimization'],
  },
  {
    title: 'Data Engineer',
    description: 'Builds and maintains data pipelines and infrastructure for analytics.',
    requiredSkills: ['Python', 'SQL', 'ETL', 'Apache Spark', 'Data Warehousing', 'Data Modeling', 'Linux', 'Git'],
    niceToHaveSkills: ['Airflow', 'Kafka', 'AWS', 'Snowflake', 'dbt', 'Databricks', 'Docker', 'Stream Processing'],
  },
  {
    title: 'Data Scientist',
    description: 'Analyzes data and builds models to extract insights and predictions.',
    requiredSkills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Statistics', 'Data Cleaning', 'Data Visualization', 'Jupyter'],
    niceToHaveSkills: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'R', 'A/B Testing', 'Feature Engineering', 'Natural Language Processing'],
  },
  {
    title: 'Machine Learning Engineer',
    description: 'Designs, builds, and deploys machine learning models into production systems.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Model Evaluation', 'Data Structures', 'Git'],
    niceToHaveSkills: ['MLOps', 'Docker', 'Kubernetes', 'AWS SageMaker', 'NLP', 'Computer Vision', 'Feature Stores', 'Apache Spark'],
  },
  {
    title: 'QA Engineer',
    description: 'Ensures software quality through manual and structured testing processes.',
    requiredSkills: ['Manual Testing', 'Test Case Design', 'Bug Tracking', 'SQL', 'Agile', 'Regression Testing', 'Test Planning'],
    niceToHaveSkills: ['API Testing', 'Postman', 'JIRA', 'Basic Scripting', 'Selenium', 'Performance Testing', 'CI/CD'],
  },
  {
    title: 'Automation Test Engineer',
    description: 'Builds automated test suites to validate software functionality and reliability.',
    requiredSkills: ['Selenium', 'Java', 'Test Automation', 'Git', 'API Testing', 'Test Frameworks', 'SQL', 'CI/CD'],
    niceToHaveSkills: ['Cypress', 'Playwright', 'Postman', 'Python', 'Docker', 'Performance Testing', 'JIRA'],
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Monitors, detects, and responds to security threats and vulnerabilities.',
    requiredSkills: ['Network Security', 'SIEM Tools', 'Vulnerability Assessment', 'Linux', 'Incident Response', 'Security Monitoring', 'Risk Assessment'],
    niceToHaveSkills: ['Penetration Testing', 'Python', 'Cloud Security', 'Firewalls', 'Compliance Standards', 'Digital Forensics', 'Threat Intelligence'],
  },
  {
    title: 'Technical Support Engineer',
    description: 'Provides technical troubleshooting and support for software products and customers.',
    requiredSkills: ['Troubleshooting', 'Customer Communication', 'SQL', 'Ticketing Systems', 'Networking Basics', 'Technical Documentation', 'Operating Systems'],
    niceToHaveSkills: ['Scripting', 'Linux', 'API Basics', 'Cloud Platforms', 'ITIL', 'Remote Support', 'Monitoring Tools'],
  },
  {
    title: 'Technical Project Manager',
    description: 'Plans and coordinates technical projects, teams, and delivery timelines.',
    requiredSkills: ['Project Management', 'Agile', 'Scrum', 'Stakeholder Communication', 'Risk Management', 'Project Planning', 'Technical Documentation'],
    niceToHaveSkills: ['JIRA', 'Technical Background', 'Budgeting', 'Roadmapping', 'Confluence', 'Change Management', 'Product Development'],
  },
  {
    title: 'Product Manager',
    description: 'Defines product strategy, roadmap, and coordinates cross-functional teams to deliver features.',
    requiredSkills: ['Product Strategy', 'Roadmapping', 'User Research', 'Agile', 'Stakeholder Communication', 'Requirements Management', 'Market Analysis'],
    niceToHaveSkills: ['SQL', 'A/B Testing', 'Figma', 'Data Analysis', 'JIRA', 'Product Analytics', 'Go-to-Market Strategy'],
  },
  {
    title: 'UI/UX Designer',
    description: 'Designs user interfaces and experiences for digital products.',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Interaction Design', 'Usability Testing'],
    niceToHaveSkills: ['HTML', 'CSS', 'Design Systems', 'Adobe XD', 'Accessibility', 'Information Architecture', 'User Journey Mapping'],
  },
  {
    title: 'Solutions Architect',
    description: 'Designs high-level technical solutions and system architecture for complex projects.',
    requiredSkills: ['System Design', 'Cloud Architecture', 'AWS', 'Microservices', 'API Design', 'Networking', 'Security Architecture', 'Technical Leadership'],
    niceToHaveSkills: ['Kubernetes', 'Cost Optimization', 'Terraform', 'Azure', 'Event-Driven Architecture', 'Data Architecture', 'Architecture Documentation'],
  },
  {
    title: 'Database Administrator',
    description: 'Manages, optimizes, and secures database systems.',
    requiredSkills: ['SQL', 'Database Design', 'Performance Tuning', 'Backup & Recovery', 'MySQL', 'Database Security', 'Monitoring', 'Troubleshooting'],
    niceToHaveSkills: ['PostgreSQL', 'MongoDB', 'Cloud Databases', 'Replication', 'High Availability', 'Shell Scripting', 'Disaster Recovery'],
  },
  {
    title: 'Mobile Developer',
    description: 'Builds mobile applications for iOS and Android platforms.',
    requiredSkills: ['React Native', 'JavaScript', 'REST APIs', 'Git', 'Mobile UI Design', 'State Management', 'Mobile Testing'],
    niceToHaveSkills: ['Swift', 'Kotlin', 'Flutter', 'Firebase', 'App Store Deployment', 'Push Notifications', 'Offline Storage'],
  },
  {
    title: 'Embedded Systems Engineer',
    description: 'Develops software for hardware-integrated systems and devices.',
    requiredSkills: ['C', 'C++', 'Embedded Systems', 'Microcontrollers', 'RTOS', 'Debugging Tools', 'Data Structures'],
    niceToHaveSkills: ['ARM Architecture', 'IoT Protocols', 'Circuit Basics', 'Embedded Linux', 'Firmware Development', 'Communication Protocols', 'Hardware Testing'],
  },
  {
    title: 'Technical Lead',
    description: 'Leads a development team technically, guiding architecture and code quality.',
    requiredSkills: ['System Design', 'Code Review', 'Mentoring', 'Agile', 'Architecture Decisions', 'Technical Leadership', 'Software Development'],
    niceToHaveSkills: ['Cloud Platforms', 'CI/CD', 'Performance Optimization', 'Cross-team Collaboration', 'Hiring', 'Project Planning', 'Incident Management'],
  },
  {
    title: 'Engineering Manager',
    description: 'Manages engineering teams, balancing technical direction with people leadership.',
    requiredSkills: ['People Management', 'Technical Leadership', 'Agile', 'Hiring', 'Performance Reviews', 'Delivery Management', 'Stakeholder Communication'],
    niceToHaveSkills: ['Budgeting', 'Cross-functional Communication', 'System Design', 'Roadmapping', 'Coaching', 'Organizational Design', 'Engineering Metrics'],
  },
];

const seedJobRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await JobRole.deleteMany({});
    console.log('Existing job roles cleared.');

    await JobRole.insertMany(jobRoles);
    console.log(`${jobRoles.length} job roles seeded successfully!`);

    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedJobRoles();