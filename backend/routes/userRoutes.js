const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser, getMaintenanceStaff } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getUsers);
router.get('/maintenance-staff', protect, authorize('warden', 'admin'), getMaintenanceStaff);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
