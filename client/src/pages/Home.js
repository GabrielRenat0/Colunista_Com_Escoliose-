import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { postsService } from '../services/api';

const CATEGORIES = ['Todos', 'Futebol', 'Basquete', 'Automobilismo', 'Tênis', 'Geral'];

export default function Home() {
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [category, setCategory]     = useState('Todos');
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [category, page]);

  async function fetchPosts() {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 9 };
      if (category !== 'Todos') params.category = category;
      const { data } = await postsService.getAll(params);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError('Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  }

  function handleCategory(cat) {
    setCategory(cat);
    setPage(1);
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Hero */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>⚡ Sports<span style={{ color: 'var(--accent)' }}>Blog</span></h1>
        <p style={styles.heroSub}>As melhores notícias do mundo esportivo</p>
      </header>

      {/* Filtro de categorias */}
      <div style={styles.categories}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={{
              ...styles.catBtn,
              ...(category === cat ? styles.catBtnActive : {}),
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Estado de loading / erro */}
      {loading && <p style={styles.status}>Carregando...</p>}
      {error   && <p className="alert alert-error">{error}</p>}

      {/* Grid de posts */}
      {!loading && posts.length === 0 && (
        <p style={styles.status}>Nenhum post encontrado para esta categoria.</p>
      )}
      <div style={styles.grid}>
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            className="btn btn-outline"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >← Anterior</button>
          <span style={{ color: 'var(--muted)' }}>
            Página {page} de {pagination.totalPages}
          </span>
          <button
            className="btn btn-outline"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
          >Próxima →</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  hero: { textAlign: 'center', marginBottom: '2.5rem' },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    letterSpacing: '0.05em',
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  heroSub: { color: 'var(--muted)', fontSize: '1.1rem' },
  categories: {
    display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
    marginBottom: '2rem',
  },
  catBtn: {
    background: 'var(--card)',
    border: '1.5px solid var(--border)',
    color: 'var(--muted)',
    padding: '0.4rem 1rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  catBtnActive: {
    background: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  status: { color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' },
  pagination: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: '1rem', marginTop: '3rem',
  },
};
