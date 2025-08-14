const Complaint = require('../models/Complaint');

//Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const payload = { 
      ...req.body, 
      status: 'Open', 
      completionDate: null 
    };
    const doc = await Complaint.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Get all complaints
const getComplaints = async (req, res) => {
  try {
    const docs = await Complaint.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update complaint details
const updateComplaint = async (req, res) => {
  try {
    const allowed = [
      'complainantName',
      'email',
      'phoneNumber',
      'title',
      'description',
      'category',
      'assignedTo'
    ];
    const updates = {};
    for (const k of allowed) {
      if (k in req.body) updates[k] = req.body[k];
    }

    const doc = await Complaint.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Close without resolution
const closeWithoutResolution = async (req, res) => {
  try {
    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'Closed - No Resolution', completionDate: new Date() },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaint,
  closeWithoutResolution
};
