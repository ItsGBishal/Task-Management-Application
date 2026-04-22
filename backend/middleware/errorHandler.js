const errorHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  return res.status(statusCode).json({
    message: err.message || 'Server error'
  });
};

module.exports = errorHandler;
