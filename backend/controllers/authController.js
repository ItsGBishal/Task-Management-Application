const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required');
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: createToken(user._id),
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      token: createToken(user._id),
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
