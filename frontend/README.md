# Todo Frontend

React frontend application for the Todo app built with Vite and Tailwind CSS.

## Features

- 📝 Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔍 Filter todos by status (all, active, completed)
- 📊 Sort todos by date or priority
- ⚡ Fast refresh with Vite
- 🔄 Loading states and error handling
- 📱 Mobile-responsive design

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

## Installation

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── TodoForm.jsx      # Form to create new todos
│   │   ├── TodoItem.jsx      # Individual todo item display
│   │   ├── TodoList.jsx      # List of todos
│   │   └── TodoFilters.jsx   # Filter and sort controls
│   ├── context/
│   │   └── TodoContext.jsx   # State management
│   ├── services/
│   │   └── todoApi.js        # API client
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features Overview

### Todo Management
- **Create**: Add new todos with title, description, and priority
- **Edit**: Update existing todos inline
- **Delete**: Remove todos with confirmation
- **Toggle**: Mark todos as complete/incomplete with a single click

### Filtering
- **All**: Show all todos
- **Active**: Show only incomplete todos
- **Completed**: Show only completed todos

### Sorting
- **By Date**: Most recent first (default)
- **By Priority**: High, Medium, Low

### UI States
- **Loading**: Shows spinner while fetching data
- **Error**: Displays error messages when operations fail
- **Empty**: Shows helpful message when no todos match filter

## API Integration

The frontend communicates with the backend API running on port 3001. The Vite proxy configuration automatically forwards `/api` requests to the backend server.

## Styling

This app uses Tailwind CSS for styling with a custom color scheme:
- Primary: Blue shades for actions and highlights
- Success: Green for completed items
- Warning: Yellow/Orange for medium priority
- Danger: Red for high priority and delete actions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
