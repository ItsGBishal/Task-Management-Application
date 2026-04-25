# Zenith Task Manager

A full-stack, responsive task management application built to help users plan their work and finish with calm.

## Features

*   **User Authentication & Authorization:** Secure registration and login using JWT (JSON Web Tokens). Users only see their own tasks.
*   **CRUD Operations for Tasks:** Create, Read, Update, and Delete tasks.
*   **Real-time Updates:** Integrated with WebSockets (`socket.io`) to instantly reflect task changes across multiple browser sessions.
*   **Advanced Filtering & Search:** Filter tasks by status (Pending, In Progress, Completed) and search by title or description.
*   **Prioritization & Deadlines:** Assign priority levels (Low, Medium, High) and due dates to tasks.
*   **Responsive Design:** Beautiful, custom dark-mode UI that works seamlessly on desktop, tablet, and mobile screens.

## Technology Stack

*   **Frontend:** HTML5, Vanilla CSS (Custom Design System), Vanilla JavaScript
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (using Mongoose)
*   **Real-time Communication:** Socket.io
*   **Authentication:** JWT, bcryptjs

## Prerequisites

Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ItsGBishal/Task-Management-Application.git
cd Task-Management-Application
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5500
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npx serve -s -l 5500
```

### 4. Open the App
Visit `http://localhost:5500` in your browser.
