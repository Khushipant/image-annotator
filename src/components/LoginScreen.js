import React, { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '123456') {
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '93vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FFFF',
    padding: 16,
  },
  card: {
    backgroundColor: '#ADD8E6',
    borderRadius: 16,
    padding: '32px 24px',
    width: '100%',
    maxWidth: 350,

  },
  title: {
    color: '#000',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 24,
  },
  input: {
    width: '330px',
    padding: '10px',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 14,
    outline: 'none',
    transition: 'border 0.3s',
  },
  button: {
    width: '350px',
    padding: 12,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default LoginScreen;
