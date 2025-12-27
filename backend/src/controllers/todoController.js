import { statements } from '../models/db.js';

// Helper to convert SQLite integer to boolean for completed field
const formatTodo = (todo) => ({
  ...todo,
  completed: Boolean(todo.completed)
});

// GET /api/todos - Get all todos
export const getAllTodos = (req, res) => {
  try {
    const todos = statements.getAll.all();
    res.json(todos.map(formatTodo));
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// GET /api/todos/:id - Get a single todo by ID
export const getTodoById = (req, res) => {
  try {
    const { id } = req.params;
    const todo = statements.getById.get(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(formatTodo(todo));
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

// POST /api/todos - Create a new todo
export const createTodo = (req, res) => {
  try {
    const { title, description, priority } = req.body;
    
    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const validPriorities = ['low', 'medium', 'high'];
    const todoPriority = priority || 'medium';
    
    if (!validPriorities.includes(todoPriority)) {
      return res.status(400).json({ 
        error: 'Priority must be one of: low, medium, high' 
      });
    }
    
    const result = statements.create.run(
      title.trim(),
      description?.trim() || null,
      todoPriority
    );
    
    const newTodo = statements.getById.get(result.lastInsertRowid);
    res.status(201).json(formatTodo(newTodo));
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// PUT /api/todos/:id - Update an existing todo
export const updateTodo = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, completed } = req.body;
    
    // Check if todo exists
    const existingTodo = statements.getById.get(id);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        error: 'Priority must be one of: low, medium, high' 
      });
    }
    
    statements.update.run(
      title.trim(),
      description?.trim() || null,
      priority || existingTodo.priority,
      completed !== undefined ? (completed ? 1 : 0) : existingTodo.completed,
      id
    );
    
    const updatedTodo = statements.getById.get(id);
    res.json(formatTodo(updatedTodo));
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

// DELETE /api/todos/:id - Delete a todo
export const deleteTodo = (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if todo exists
    const existingTodo = statements.getById.get(id);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    statements.delete.run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

// PATCH /api/todos/:id/toggle - Toggle todo completion status
export const toggleTodo = (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if todo exists
    const existingTodo = statements.getById.get(id);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    statements.toggleComplete.run(id);
    const updatedTodo = statements.getById.get(id);
    res.json(formatTodo(updatedTodo));
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
};
