import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      navigate('/dashboard');
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      {/* 🔐 Title with logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <h2 style={{ fontFamily: 'papyrus', margin: 0 }}>Login to CredHex</h2>
        <img
          src="/logo.jpg"
          alt="icon"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            transform: 'rotate(15deg)'
          }}
        />
      </div>

      {/* 👋 Welcome text */}
      <p className="welcome-paragraph">
        Welcome back to <strong>CredHex</strong> — your personal digital vault for certificates. Access your secure storage, upload new documents, or review your existing certificates with confidence. Your credentials are protected and always available whenever you need them.
      </p>

      {/* 🔐 Login Form */}
      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        style={{ textAlign: 'center' }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        style={{ textAlign: 'center' }}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
