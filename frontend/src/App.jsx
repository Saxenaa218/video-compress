import { TodoProvider } from './context/TodoContext';
import TodoForm from './components/TodoForm';
import TodoFilters from './components/TodoFilters';
import TodoList from './components/TodoList';

function App() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              📝 Todo App
            </h1>
            <p className="text-gray-600">Organize your tasks efficiently</p>
          </header>

          {/* Main Content */}
          <div className="space-y-6">
            <TodoForm />
            <TodoFilters />
            <TodoList />
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-600 text-sm">
            <p>Built with React, Express, and SQLite</p>
          </footer>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
