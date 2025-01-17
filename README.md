# Task Management API

A RESTful API for managing tasks with user authentication. Built with Node.js, Express, and MongoDB.

## Features

- User Authentication (JWT-based)
- Task Management (CRUD Operations)
- MongoDB Database Integration
- Secure Password Hashing
- Task Status Tracking

## Tech Stack

- Node.js & Express.js
- MongoDB Database
- Mongoose ODM
- JSON Web Tokens (JWT)
- bcryptjs for Password Hashing
- CORS Enabled

## Prerequisites

- Node.js (v18.x)
- MongoDB Atlas Account
- npm (Node Package Manager)

## Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/saran-2004/task-management-api.git 
cd task-management-api
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key
```

4. **Start the Server**
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
    "_id": "65f2...",
    "title": "Complete Project",
    "description": "Finish the task management API",
    "status": "pending",
    "user": "65f2...",
    "createdAt": "2024-03-13T...",
    "updatedAt": "2024-03-13T..."
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
        "_id": "65f2...",
        "title": "Complete Project",
        "description": "Finish the task management API",
        "status": "pending",
        "user": "65f2...",
        "createdAt": "2024-03-13T...",
        "updatedAt": "2024-03-13T..."
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

```json
// Authentication Error
{
    "error": "Please authenticate"
}

// Invalid Credentials
{
    "error": "Invalid login credentials"
}

// Resource Not Found
{
    "error": "Task not found"
}

// Duplicate Entry
{
    "error": "Username already exists"
}
```

## Task Status Options

- `pending` (default)
- `in-progress`
- `completed`

## Testing with Postman

1. Import the provided collection:
   - Collection URL: [Task Management API Collection](https://github.com/Saran-official-59/Task-management-api/blob/main/Task%20management%20API.postman_collection.json)

2. Set up environment variables:
   ```javascript
   // After login, in the "Tests" tab add:
   if (pm.response.code === 200) {
       pm.environment.set('token', pm.response.json().token);
   }
   ```

3. Use `{{token}}` in your Authorization headers:
   ```
   Authorization: Bearer {{token}}
   ```

4. The collection includes:
   - Authentication endpoints (Register, Login)
   - Task management endpoints (Create, Read, Update, Delete)
   - Pre-configured headers and authentication
   - Example request bodies

## Security Features

- Password Hashing using bcrypt
- JWT-based Authentication
- MongoDB Injection Protection
- CORS Enabled
- Input Validation

## Deployment

This API is deployed on Render with MongoDB Atlas.

### Live API Endpoint
Base URL: [https://task-management-api-mbah.onrender.com](https://task-management-api-mbah.onrender.com)

Example endpoints:
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Create Task: `POST /api/tasks`
- Get Tasks: `GET /api/tasks`
- Update Task: `PATCH /api/tasks/:id`
- Delete Task: `DELETE /api/tasks/:id`

### Environment Variables for Deployment
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT
- `PORT`: Port number (provided by Render)

### Deployment Steps

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

### Testing the Deployed API

You can test the deployed API using either:

1. Postman Collection:
   - Import the [Task Management API Collection](https://github.com/Saran-official-59/Task-management-api/blob/main/Task%20management%20API.postman_collection.json)
   - Update the environment variable `BASE_URL` to `https://task-management-api-mbah.onrender.com`

2. Direct API calls:
   ```bash
   # Register
   curl -X POST https://task-management-api-mbah.onrender.com/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"username":"testuser","password":"123456"}'
   ```