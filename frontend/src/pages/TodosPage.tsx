import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Todo } from '../types';

export default function TodosPage() {
  const { logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  useEffect(() => { client.get<Todo[]>('/todos').then((r) => setTodos(r.data)); }, []);
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
  const remove = async (id: number) => { await client.delete(`/todos/${id}`); setTodos(todos.filter((t)=>t.id!==id)); };
  return <div><button onClick={logout}>Logout</button><h2>Todos</h2><input value={title} onChange={(e)=>setTitle(e.target.value)} /><button onClick={add}>Add</button>{todos.map((t)=><div key={t.id}><input type="checkbox" checked={t.completed} onChange={()=>toggle(t)} /><span>{t.title}</span><button onClick={()=>remove(t.id)}>Delete</button></div>)}</div>;
}
