import React, { useState, useEffect } from 'react';
import "./App.css"
const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTodos, setSelectedTodos] = useState([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSave = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleTodoSelect = (todoId) => {
    setSelectedTodos(prev =>
      prev.includes(todoId)
        ? prev.filter(id => id !== todoId)
        : [...prev, todoId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedTodos.length > 0) {
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedTodos.length} selected todo(s)?`);
      if (confirmed) {
        const updatedTodos = todos.filter(todo => !selectedTodos.includes(todo.id));
        setTodos(updatedTodos);
        setSelectedTodos([]);
      }
    }
  };

  const handleFlushAll = () => {
    if (todos.length > 0) {
      const confirmed = window.confirm('Are you sure you want to delete ALL todos? This action cannot be undone.');
      if (confirmed) {
        setTodos([]);
        setSelectedTodos([]);
        localStorage.removeItem('todos'); // Also clear from localStorage
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo List</h1>
          <p className="text-gray-600">Stay organized and get things done</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* Input Section */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter details..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700"
            />
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium shadow-lg"
            >
              Save
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleDeleteSelected}
              disabled={selectedTodos.length === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTodos.length > 0
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Delete Selected ({selectedTodos.length})
            </button>

            <button
              onClick={handleFlushAll}
              disabled={todos.length === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                todos.length > 0
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Flush All
            </button>
          </div>

          {/* Todo List */}
          <div className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No todos yet. Add one above!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedTodos.includes(todo.id)
                      ? 'border-blue-300 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedTodos.includes(todo.id)}
                    onChange={() => handleTodoSelect(todo.id)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mr-4"
                  />
                  <span className="flex-1 text-gray-700 text-lg">{todo.text}</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleTodoSelect(todo.id)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const updatedTodos = todos.filter(t => t.id !== todo.id);
                        setTodos(updatedTodos);
                        setSelectedTodos(prev => prev.filter(id => id !== todo.id));
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Total todos: {todos.length} | Selected: {selectedTodos.length}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
