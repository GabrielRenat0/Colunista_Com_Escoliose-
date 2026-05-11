import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    postsService.getById(id)
      .then(({ data }) => setPost(data))
      .catch(() => setError('Post não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Tem certeza que deseja deletar este post?')) return;
    try {
      await postsService.delete(id);
      navigate('/');
    } catch {
      alert('Erro ao deletar post.');
    }
  }

  if (loading) return <div style={styles.status}>Carregando...</div>;
  if (error)   return <div style={{ ...styles.status, color: 'var(--accent)' }}>{error} <Link to="/">← Voltar</Link></div>;

  const canEdit = user && (user.id === post.author_id || user.role === 'admin');

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '780px' }}>
      <Link to="/" style={styles.back}>← Todos os posts</Link>

      {post.image_url && (
        <img src={post.image_url} alt={post.title} style={styles.heroImg} />
      )}

      <div style={styles.meta}>
        <span className="tag">{post.category}</span>
        <span style={styles.date}>
          {new Date(post.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
          })}
        </span>
        <span style={styles.author}>por {post.author_name}</span>
      </div>

      <h1 style={styles.title}>{post.title}</h1>

      <div style={styles.content}>
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {canEdit && (
        <div style={styles.actions}>
          <button onClick={handleDelete} className="btn btn-outline" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>
            🗑 Deletar
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  status: { color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' },
  back: { color: 'var(--muted)', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1.5rem' },
  heroImg: { width: '100%', height: '380px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' },
  meta: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' },
  date: { fontSize: '0.85rem', color: 'var(--muted)' },
  author: { fontSize: '0.85rem', color: '#666' },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    lineHeight: 1.1,
    letterSpacing: '0.02em',
    marginBottom: '1.5rem',
  },
  content: {
    fontSize: '1.05rem', lineHeight: 1.8, color: '#ccc',
    display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  actions: { marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' },
};
