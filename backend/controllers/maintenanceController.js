const Maintenance = require('../models/Maintenance');
const Complaint = require('../models/Complaint');

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Maintenance.find({ staffId: req.user._id })
      .populate({
        path: 'complaintId',
        populate: { path: 'studentId', select: 'name email' }
      })
      .sort({ updatedAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Complaint.findByIdAndUpdate(task.complaintId, { status });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Maintenance.find()
      .populate('staffId', 'name email')
      .populate({
        path: 'complaintId',
        populate: { path: 'studentId', select: 'name email' }
      })
      .sort({ updatedAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyTasks, updateTaskStatus, getAllTasks };
