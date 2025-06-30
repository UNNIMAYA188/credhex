import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-box">
    <div className="home-container">
      <img src="/favicon.png" alt="CresHex Logo" className="logohome" />
<h1 className="title">
  {'CredHex'.split('').map((char, index) => (
    <span key={index} className="char" style={{ animationDelay: `${index * 0.1}s` }}>
      {char}
    </span>
  ))}
</h1>
      <p className="subtitle">Your Perfect Companion For Secure Digital Certificate Vault</p>
      <button onClick={() => navigate('/register')} className="home-button">
        Login / Sign Up
      </button>
    </div>
    </div>
  );
}

export default Home;
