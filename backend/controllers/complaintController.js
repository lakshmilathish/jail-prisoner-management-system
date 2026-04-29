const Complaint = require('../models/Complaint');
const Maintenance = require('../models/Maintenance');

const createComplaint = async (req, res) => {
  const { roomNumber, description } = req.body;
  try {
    const complaint = await Complaint.create({
      studentId: req.user._id,
      roomNumber,
      description
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignComplaint = async (req, res) => {
  const { staffId } = req.body;
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'In Progress' },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const existing = await Maintenance.findOne({ complaintId: req.params.id });
    if (existing) {
      existing.staffId = staffId;
      existing.status = 'In Progress';
      existing.updatedAt = Date.now();
      await existing.save();
    } else {
      await Maintenance.create({
        complaintId: req.params.id,
        staffId,
        status: 'In Progress'
      });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplaint, getAllComplaints, getMyComplaints, updateComplaintStatus, assignComplaint };
