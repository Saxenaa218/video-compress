# Todo Backend API

RESTful API server for the Todo application built with Node.js, Express, and SQLite.

## Features

- RESTful API endpoints for CRUD operations
- SQLite database for data persistence
- Input validation and error handling
- CORS support for frontend integration
- Hot reloading in development mode

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **better-sqlite3** - SQLite database driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables management

## Installation

```bash
npm install
```

## Running the Server

### Development Mode (with hot reloading)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=3001
NODE_ENV=development
```

See `.env.example` for reference.

## API Endpoints

### Get All Todos
```
GET /api/todos
```

Response: Array of todo objects

### Get Single Todo
```
GET /api/todos/:id
```

Response: Single todo object

### Create Todo
```
POST /api/todos
Content-Type: application/json

{
  "title": "Task title",
  "description": "Optional description",
  "priority": "medium" // low, medium, or high
}
```

Response: Created todo object

### Update Todo
```
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "high",
  "completed": true
}
```

Response: Updated todo object

### Delete Todo
```
DELETE /api/todos/:id
```

Response: 204 No Content

### Toggle Todo Completion
```
PATCH /api/todos/:id/toggle
```

Response: Updated todo object

## Database Schema

### Todo Model

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| title | TEXT | Todo title (required) |
| description | TEXT | Optional description |
| completed | INTEGER | 0 (false) or 1 (true), default: 0 |
| priority | TEXT | 'low', 'medium', or 'high', default: 'medium' |
| createdAt | TEXT | ISO 8601 timestamp |
| updatedAt | TEXT | ISO 8601 timestamp |

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

Common status codes:
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── todoController.js  # Business logic
│   ├── models/
│   │   └── db.js              # Database setup and queries
│   ├── routes/
│   │   └── todoRoutes.js      # API route definitions
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling
│   └── index.js               # Server entry point
├── package.json
└── README.md
```

## Database

The SQLite database file (`todos.db`) is created automatically in the backend directory when the server starts. Data persists across server restarts.
