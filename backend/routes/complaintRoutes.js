const router = require('express').Router();
const {
  createComplaint,
  getComplaints,
  updateComplaint,
  closeWithoutResolution
} = require('../controllers/complaintController');

router.post('/', createComplaint);
router.get('/', getComplaints);
router.patch('/:id', updateComplaint);
router.post('/:id/close-no-resolution', closeWithoutResolution);

module.exports = router;
