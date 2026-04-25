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
