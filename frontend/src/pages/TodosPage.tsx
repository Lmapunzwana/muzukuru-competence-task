import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Todo } from '../types';

export default function TodosPage() {
  const { logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    client.get<Todo[]>('/todos').then((r) => setTodos(r.data));
  }, []);

  const add = async () => {
    if (!title.trim()) return;
    const { data } = await client.post<Todo>('/todos', { title });
    setTodos([data, ...todos]);
    setTitle('');
  };

  const toggle = async (todo: Todo) => {
    const { data } = await client.patch<Todo>(`/todos/${todo.id}`, { completed: !todo.completed });
    setTodos(todos.map((t) => (t.id === data.id ? data : t)));
  };

  const remove = async (id: number) => {
    await client.delete(`/todos/${id}`);
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Tasks</h2>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-3">
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
            />
            <button
              onClick={add}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No tasks yet. Add one above!</p>
          ) : (
            todos.map((t) => (
              <div
                key={t.id}
                className="group flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={t.completed}
                    onChange={() => toggle(t)}
                  />
                  <span className={`text-lg transition-all ${t.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                    {t.title}
                  </span>
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Delete todo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}