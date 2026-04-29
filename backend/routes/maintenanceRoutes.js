const express = require('express');
const router = express.Router();
const { getMyTasks, updateTaskStatus, getAllTasks } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'warden'), getAllTasks);
router.get('/mine', protect, authorize('maintenance'), getMyTasks);
router.put('/:id', protect, authorize('maintenance'), updateTaskStatus);

module.exports = router;
