const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getAllJobRoles, getSkillGap } = require('../controllers/jobRoleController');

const router = express.Router();

router.get('/', getAllJobRoles);
router.get('/:roleId/skill-gap', protect, getSkillGap);

module.exports = router;