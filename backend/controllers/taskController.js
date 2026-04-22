const Task = require('../models/Task');

const emitTaskChange = (req, event, payload) => {
  const io = req.app.get('io');
  if (io) io.to(`user:${req.user._id}`).emit(event, payload);
};

const getTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = { userId: req.user._id };

    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Task title is required');
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      userId: req.user._id
    });

    emitTaskChange(req, 'task:created', task);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        task[field] = field === 'dueDate' && !req.body[field] ? null : req.body[field];
      }
    });

    const updatedTask = await task.save();
    emitTaskChange(req, 'task:updated', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    emitTaskChange(req, 'task:deleted', { id: req.params.id });
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
