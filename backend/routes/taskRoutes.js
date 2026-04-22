const express = require('express');
const {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;
