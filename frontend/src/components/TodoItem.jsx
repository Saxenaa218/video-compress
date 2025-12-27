import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';

const TodoItem = ({ todo }) => {
  const { toggleTodo, updateTodo, deleteTodo } = useTodoContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  const handleToggle = async () => {
    try {
      await toggleTodo(todo.id);
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert('Title is required');
      return;
    }

    try {
      await updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
        completed: todo.completed,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating todo:', err);
      alert('Failed to update todo: ' + err.message);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTodo(todo.id);
    } catch (err) {
      console.error('Error deleting todo:', err);
      alert('Failed to delete todo: ' + err.message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-blue-500">
        <div className="mb-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
          />
        </div>
        <div className="mb-3">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            rows="2"
          />
        </div>
        <div className="mb-3">
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-3 transition duration-200 hover:shadow-lg ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mt-1 w-5 h-5 cursor-pointer"
        />
        
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-lg font-semibold ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {todo.title}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium border ${
              priorityColors[todo.priority]
            }`}>
              {todo.priority.toUpperCase()}
            </span>
          </div>
          
          {todo.description && (
            <p className={`text-gray-600 mb-2 ${
              todo.completed ? 'line-through' : ''
            }`}>
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Created: {new Date(todo.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-200"
          disabled={isDeleting}
        >
          Edit
        </button>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
            disabled={isDeleting}
          >
            Delete
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition duration-200"
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
