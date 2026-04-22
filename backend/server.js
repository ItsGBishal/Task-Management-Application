const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CLIENT_URL || '*';

// Socket.io lets open browser sessions refresh when a task changes elsewhere.
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

connectDB();

app.set('io', io);
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Zenith Task Manager API is running' });
});

// Keep the API split by domain so auth and task logic stay easy to extend.
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('join-user-room', (userId) => {
    if (userId) socket.join(`user:${userId}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
