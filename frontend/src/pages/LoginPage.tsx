import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { TokenResponse } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await client.post<TokenResponse>('/login', { email, password });
      login(data.access_token, null);
      navigate('/todos');
    } catch {
      setError('Invalid credentials');
    }
  };

  return <form onSubmit={onSubmit}><h2>Login</h2>{error && <p>{error}</p>}<input value={email} onChange={(e)=>setEmail(e.target.value)} /><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><button type="submit">Login</button></form>;
}
