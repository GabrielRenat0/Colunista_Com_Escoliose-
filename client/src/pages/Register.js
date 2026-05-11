import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      return setError('As senhas não coincidem.');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚡ Cadastro</h1>
        <p style={styles.sub}>Crie sua conta para publicar no Sports Blog</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" name="name" placeholder="Seu nome" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" name="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" name="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Confirmar Senha</label>
            <input type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange} required />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p style={styles.footer}>
          Já tem conta? <Link to="/login" style={{ color: 'var(--accent)' }}>Entre aqui</Link>
        </p>
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
};
