# Task Management API

A RESTful API for managing tasks with user authentication. Built with Node.js, Express, and MySQL.

## Features

- User Authentication (JWT-based)
- Task Management (CRUD Operations)
- MySQL Database Integration
- Secure Password Hashing
- Task Status Tracking

## Tech Stack

- Node.js & Express.js
- MySQL Database
- Sequelize ORM
- JSON Web Tokens (JWT)
- bcryptjs for Password Hashing
- CORS Enabled

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (Node Package Manager)

## Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/saran-2004/task-management-api.git 

cd task-management-api
```

2. **Install Dependencies**
```bash
    npm install express sequelize mysql2 bcryptjs jsonwebtoken cors dotenv
```
3. **Database Setup**
```sql
CREATE DATABASE task_management;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

4. **Environment Configuration**
Create a `.env` file in the root directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management
JWT_SECRET=your-secret-key
```

5. **Start the Server**
```bash
node server.js
```

## API Documentation

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "example_user",
    "password": "secure_password"
}
```

**Response:**
```json
{
    "message": "Registration successful."
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "example_user",
    "password": "secure_password"
}
```

**Response:**
```json
{
    "message": "Login successful.",
    "token": "eyJhbGciOiJ..."
}
```

### Task Management Endpoints

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Complete Project",
    "description": "Finish the task management API",
    "status": "pending"
}
```

**Response:**
```json
{
    "id": 1,
    "title": "Complete Project",
    "description": "Finish the task management API",
    "status": "pending",
    "user_id": 1,
    "created_at": "2024-02-20T...",
    "updated_at": "2024-02-20T..."
}
```

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": 1,
        "title": "Complete Project",
        "description": "Finish the task management API",
        "status": "pending",
        "user_id": 1,
        "created_at": "2024-02-20T...",
        "updated_at": "2024-02-20T..."
    }
]
```

#### Update Task
```http
PATCH /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "status": "completed",
    "description": "Updated description"
}
```

**Response:**
```json
{
    "message": "Task updated successfully",
    "status": "completed",
    "description": "Updated description"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
    "message": "Task \"Complete Project\" deleted successfully"
}
```

## Error Responses

```