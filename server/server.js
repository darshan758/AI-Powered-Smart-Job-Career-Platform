const dotenv = require('dotenv');
dotenv.config();  // ← MUST run before requiring routes/anything that uses process.env

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const jobRoleRoutes = require('./routes/jobRoleRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/jobroles', jobRoleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));