const dotenv = require('dotenv');
dotenv.config();  // ← MUST run before requiring routes/anything that uses process.env

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const jobRoleRoutes = require('./routes/jobRoleRoutes');

const roadmapRoutes = require('./routes/roadmapRoutes');

const jobPostingRoutes = require('./routes/jobPostingRoutes');

const matchRoutes = require('./routes/matchRoutes');

const chatRoutes = require('./routes/chatRoutes');

const adminRoutes = require('./routes/adminRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/jobroles', jobRoleRoutes);


app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

app.use('/api/roadmap', roadmapRoutes);

app.use('/api/jobpostings', jobPostingRoutes);

app.use('/api/match', matchRoutes);

app.use('/api/chat', chatRoutes);

app.use('/api/admin', adminRoutes);




app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));