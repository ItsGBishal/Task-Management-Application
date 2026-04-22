# Zenith Task Manager

A full-stack task management web application with JWT authentication, protected task CRUD, MongoDB persistence, search, filtering, priorities, due dates, and Socket.io task refresh events.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT and bcrypt password hashing
- Realtime: Socket.io task update events

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  server.js
frontend/
  index.html
  styles.css
  script.js
```

## Run Locally

1. Install and start MongoDB locally, or create a MongoDB Atlas database.
2. Configure the backend:

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

3. Open the frontend:

```bash
cd ../frontend
python -m http.server 5500
```

4. Visit `http://localhost:5500`.

If you use MongoDB Atlas, replace `MONGO_URI` in `backend/.env` with your Atlas connection string. Keep `CLIENT_URL=http://localhost:5500` for local development.

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zenith_task_manager
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5500
```

## API Testing With Postman

### Register

POST `http://localhost:5000/api/auth/register`

```json
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "password": "password123"
}
```

Copy the returned `token`.

### Login

POST `http://localhost:5000/api/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```

### Auth Header For Task Routes

Set this header for all task requests:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Task

POST `http://localhost:5000/api/tasks`

```json
{
  "title": "Prepare sprint plan",
  "description": "Break the release into shippable tasks.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-04-25"
}
```

### Get Tasks

GET `http://localhost:5000/api/tasks`

Optional query params:

```text
?status=in-progress
?search=sprint
```

### Update Task

PUT `http://localhost:5000/api/tasks/TASK_ID`

```json
{
  "title": "Prepare final sprint plan",
  "status": "completed",
  "priority": "medium"
}
```

### Delete Task

DELETE `http://localhost:5000/api/tasks/TASK_ID`

## Deployment Notes

- Backend: deploy `backend/` to Render or Railway.
- Frontend: deploy `frontend/` to Netlify or Vercel as a static site.
- Database: use MongoDB Atlas and set `MONGO_URI` in the backend host.
- Set `CLIENT_URL` on the backend to the deployed frontend URL.
- Update `API_BASE_URL` and `SOCKET_URL` in `frontend/script.js` to the deployed backend URL.
