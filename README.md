# Zenith Task Manager

A full-stack task management web application built with vanilla HTML/CSS/JavaScript on the frontend and Node.js/Express on the backend. Features JWT authentication, real-time task updates via Socket.io, task CRUD operations, search, filtering by status, priority levels, due dates, and clean client-side routing.

---

## 🚀 Features

- **JWT Authentication** — Secure register & login with bcrypt password hashing
- **Task Management** — Create, edit, complete, reopen, and delete tasks
- **Priority Levels** — Low, Medium, High with color-coded indicators
- **Status Tracking** — Pending, In Progress, Completed
- **Search & Filter** — Real-time search and filter by status
- **Real-time Updates** — Socket.io emits task events across sessions
- **Clean URL Routing** — Client-side SPA routing (`/dashboard`, `/tasks`, `/completed`)
- **Stats Dashboard** — Live counts for Total, Pending, In Progress, and Completed tasks
- **Dark UI** — Glassmorphism dark theme with smooth animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Realtime | Socket.io |
| Dev Server | Nodemon |

---

## 📁 Project Structure

```text
codex_2ndProject/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register & Login logic
│   │   └── taskController.js      # Task CRUD logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Task.js                # Task schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── index.html
    ├── styles.css
    └── script.js
```

---

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/ItsGBishal/Task-Management-Application.git
cd Task-Management-Application
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zenith_task_manager
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5500
```

> 💡 If using **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string.

Start the backend:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Serve the Frontend

Open a new terminal in the `frontend/` folder:

```bash
cd frontend
npx serve -s -l 5500
```

> ⚠️ The **`-s`** flag is required. It enables Single Page Application (SPA) mode so that clean URLs like `/dashboard` and `/completed` work correctly when you refresh the page.

### 4. Open in Browser

Visit: **`http://localhost:5500`**

---

## 🌐 Frontend Routes

| URL | View |
|---|---|
| `/dashboard` | All tasks |
| `/tasks` | Pending tasks |
| `/completed` | Completed tasks |

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

All task routes require the following header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get a JWT token |

**Register / Login Body:**
```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourpassword"
}
```

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks (supports `?status=` and `?search=`) |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

**Create / Update Task Body:**
```json
{
  "title": "Design the dashboard",
  "description": "Create a responsive layout.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-05-01"
}
```

**Status values:** `pending` | `in-progress` | `completed`

**Priority values:** `low` | `medium` | `high`

---

## ☁️ Deployment

| Part | Platform |
|---|---|
| Backend | [Render](https://render.com) or [Railway](https://railway.app) |
| Frontend | [Netlify](https://netlify.com) or [Vercel](https://vercel.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |

After deploying, update these values:

- Set `CLIENT_URL` in the backend environment to your deployed frontend URL.
- Update `API_BASE_URL` and `SOCKET_URL` in `frontend/script.js` to your deployed backend URL.
- On Netlify, create a `_redirects` file in the `frontend/` folder to enable SPA routing:

```
/*  /index.html  200
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
