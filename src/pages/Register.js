import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom'; // 👈 Link added

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) {
      alert('Registration successful! Check your email.');
      navigate('/login');
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 style={{ fontFamily: 'papyrus' }}>Register to CredHex
       <img
  src="/logo.jpg"
  alt="icon"
  style={{
    width: '40px',
    height: '40px',
    transform: 'rotate(15deg)',
    borderRadius: '50%',      // ✅ makes it circular
    objectFit: 'cover',        // ✅ ensures image fits nicely
    marginLeft: '10px', 
    marginTop: '10px'        // ✅ small spacing from text
  }}
/>

      </h2>

      {/* ✅ Welcome Paragraph */}
      <p className="welcome-paragraph">
        Welcome to <strong>CredHex</strong> — your trusted digital vault for securely storing and managing all your important certificates.
        We're excited to have you on board! Start by uploading your certificates in PDF format, and rest assured that your documents are safe,
        organized, and accessible anytime, anywhere. Let’s make your credential management smarter and more secure.
      </p>

      <input
        type="email"
        placeholder="Email"
        style={{ textAlign: 'center' }}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        style={{ textAlign: 'center' }}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="regbut" onClick={handleRegister}>Register</button>

      {/* ✅ Updated Link */}
      <p style={{ marginTop: '1rem' }}>
        Already a user?{' '}
        <Link to="/login" style={{ color: '#4caf50', textDecoration: 'underline' }}>
          Login
        </Link>
      </p>
    </div>
  );
}
