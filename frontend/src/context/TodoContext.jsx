import { createContext, useContext, useState, useEffect } from 'react';
import todoApi from '../services/todoApi';

const TodoContext = createContext();

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }
  return context;
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [sortBy, setSortBy] = useState('date'); // date, priority

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todo) => {
    try {
      const newTodo = await todoApi.createTodo(todo);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const updatedTodo = await todoApi.updateTodo(id, updates);
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleTodo = async (id) => {
    try {
      const updatedTodo = await todoApi.toggleTodo(id);
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Filter and sort todos
  const getFilteredAndSortedTodos = () => {
    let filtered = todos;

    // Apply filter
    if (filter === 'active') {
      filtered = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = todos.filter(todo => todo.completed);
    }

    // Apply sort
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered = [...filtered].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else {
      // Sort by date (already done by default from API)
      filtered = [...filtered];
    }

    return filtered;
  };

  const value = {
    todos: getFilteredAndSortedTodos(),
    allTodos: todos,
    loading,
    error,
    filter,
    sortBy,
    setFilter,
    setSortBy,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearError: () => setError(null),
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
