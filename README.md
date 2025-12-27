# Full-Stack Todo Application

A complete, reliable full-stack Todo application built with React, Express.js, and SQLite. This application demonstrates modern web development practices with a clean architecture, responsive design, and robust error handling.

## 🌟 Features

### Backend (API)
- RESTful API with Express.js
- SQLite database for data persistence
- Full CRUD operations for todos
- Input validation and error handling
- CORS support for frontend integration
- Hot reloading in development mode

### Frontend (React)
- Modern React with hooks and Context API
- Beautiful, responsive UI with Tailwind CSS
- Real-time todo management (create, edit, delete, toggle)
- Filter todos by status (all, active, completed)
- Sort todos by date or priority
- Loading states and error handling
- Mobile-responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd video-compress
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

#### Option 1: Run Both Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

#### Option 2: Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend (build and serve):**
```bash
cd frontend
npm run build
npm run preview
```

### Access the Application

Open your browser and navigate to `http://localhost:3000`

The frontend automatically proxies API requests to the backend running on port 3001.

## 📁 Project Structure

```
video-compress/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   │   └── todoController.js
│   │   ├── models/         # Database models and queries
│   │   │   └── db.js
│   │   ├── routes/         # API route definitions
│   │   │   └── todoRoutes.js
│   │   ├── middleware/     # Custom middleware
│   │   │   └── errorHandler.js
│   │   └── index.js        # Server entry point
│   ├── package.json
│   └── README.md
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── TodoForm.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── TodoList.jsx
│   │   │   └── TodoFilters.jsx
│   │   ├── context/       # State management
│   │   │   └── TodoContext.jsx
│   │   ├── services/      # API client
│   │   │   └── todoApi.js
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

## 🔌 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Get All Todos
```http
GET /api/todos
```

#### Get Single Todo
```http
GET /api/todos/:id
```

#### Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "title": "Task title",
  "description": "Optional description",
  "priority": "medium"
}
```

#### Update Todo
```http
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "high",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /api/todos/:id
```

#### Toggle Todo Completion
```http
PATCH /api/todos/:id/toggle
```

## 📊 Database Schema

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

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **better-sqlite3** - SQLite database driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Development hot reloading

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

## 🔧 Development

### Backend Development
The backend uses nodemon for hot reloading. Any changes to the source files will automatically restart the server.

```bash
cd backend
npm run dev
```

### Frontend Development
The frontend uses Vite's hot module replacement (HMR) for instant updates.

```bash
cd frontend
npm run dev
```

### Environment Variables

Backend `.env` file (optional):
```
PORT=3001
NODE_ENV=development
```

## 🧪 Testing

### Manual Testing

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Test the following features:
   - Create a new todo
   - Edit an existing todo
   - Delete a todo (with confirmation)
   - Toggle todo completion status
   - Filter by status (all, active, completed)
   - Sort by date or priority

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (below 768px)

## 🔒 Error Handling

### Backend
- Input validation on all endpoints
- Consistent error response format
- Proper HTTP status codes
- Error logging for debugging

### Frontend
- Loading states for async operations
- Error messages displayed to users
- Graceful handling of network failures
- Confirmation dialogs for destructive actions

## 🚢 Deployment

### Backend Deployment
1. Set environment variables:
   - `PORT` (optional, defaults to 3001)
   - `NODE_ENV=production`
2. Run: `npm start`
3. Database file (`todos.db`) will be created automatically

### Frontend Deployment
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve the `dist` folder using any static file server
3. Configure API proxy or update the API base URL in production

## 📝 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using React, Express, and SQLite
