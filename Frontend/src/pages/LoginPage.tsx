import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('admin_token', res.data.access_token);
      navigate('/admin');
    } catch {
      setError('Email o clave incorrectos.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Gestion</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Clave</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {error && <p className="mensaje-error">{error}</p>}
    </div>
  );
}

export default LoginPage;