import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚡ Entrar</h1>
        <p style={styles.sub}>Acesse sua conta para publicar e gerenciar posts</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.footer}>
          Não tem conta? <Link to="/register" style={{ color: 'var(--accent)' }}>Cadastre-se</Link>
        </p>

        {/* Dica para testar */}
        <div style={styles.hint}>
          <strong>Usuário demo:</strong><br />
          admin@sportsblog.com / admin123
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: 'calc(100vh - 4.5rem)', padding: '2rem',
  },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  sub: { color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.75rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' },
  hint: {
    marginTop: '1rem',
    padding: '0.75rem',
    background: 'rgba(255,61,0,0.08)',
    border: '1px solid rgba(255,61,0,0.2)',
    borderRadius: '8px',
    fontSize: '0.8rem',
    color: 'var(--muted)',
    textAlign: 'center',
  },
};
