import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsService } from '../services/api';

const CATEGORIES = ['Futebol', 'Basquete', 'Automobilismo', 'Tênis', 'Vôlei', 'Natação', 'Geral'];

export default function NewPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', content: '', category: 'Futebol', image_url: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await postsService.create(form);
      setSuccess('Post publicado com sucesso!');
      setTimeout(() => navigate(`/posts/${data.id}`), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao publicar post.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '720px' }}>
      <h1 style={styles.title}>✏️ Novo Post</h1>
      <p style={styles.sub}>Compartilhe uma notícia esportiva com a comunidade</p>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="form-group">
          <label>Título *</label>
          <input
            type="text" name="title"
            placeholder="Ex: Brasil vence a Copa do Mundo!"
            value={form.title} onChange={handleChange} required
          />
        </div>

        <div className="form-group">
          <label>Categoria</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>URL da Imagem (opcional)</label>
          <input
            type="url" name="image_url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={form.image_url} onChange={handleChange}
          />
        </div>

        {form.image_url && (
          <img
            src={form.image_url} alt="Preview"
            style={styles.preview}
            onError={e => e.target.style.display = 'none'}
          />
        )}

        <div className="form-group">
          <label>Conteúdo *</label>
          <textarea
            name="content"
            placeholder="Escreva o conteúdo do post aqui..."
            value={form.content} onChange={handleChange}
            required style={{ minHeight: '220px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/')}
          >Cancelar</button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {loading ? 'Publicando...' : '🚀 Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    letterSpacing: '0.03em',
    marginBottom: '0.4rem',
  },
  sub: { color: 'var(--muted)', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  preview: {
    width: '100%', height: '200px', objectFit: 'cover',
    borderRadius: '10px', border: '1px solid var(--border)',
  },
};
