const express = require('express');
const router = express.Router();
const { getStudents, getMyProfile, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'warden'), getStudents);
router.get('/me', protect, authorize('student'), getMyProfile);
router.put('/:id', protect, authorize('admin'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;
