import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await client.post('/register', { email, password }); navigate('/login'); }
    catch { setError('Email already registered'); }
  };

  return <form onSubmit={onSubmit}><h2>Register</h2>{error && <p>{error}</p>}<input value={email} onChange={(e)=>setEmail(e.target.value)} /><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><button type="submit">Register</button></form>;
}
