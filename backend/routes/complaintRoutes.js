const express = require('express');
const router = express.Router();
const {
  createComplaint, getAllComplaints, getMyComplaints,
  updateComplaintStatus, assignComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), createComplaint);
router.get('/', protect, authorize('warden', 'admin'), getAllComplaints);
router.get('/mine', protect, authorize('student'), getMyComplaints);
router.put('/:id/status', protect, authorize('maintenance', 'warden', 'admin'), updateComplaintStatus);
router.put('/:id/assign', protect, authorize('warden', 'admin'), assignComplaint);

module.exports = router;
