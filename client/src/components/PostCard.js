import React from 'react';
import { Link } from 'react-router-dom';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export default function PostCard({ post }) {
  return (
    <article style={styles.card}>
      {post.image_url && (
        <Link to={`/posts/${post.id}`}>
          <div style={styles.imgWrapper}>
            <img
              src={post.image_url}
              alt={post.title}
              style={styles.img}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        </Link>
      )}
      <div style={styles.body}>
        <div style={styles.meta}>
          <span className="tag">{post.category}</span>
          <span style={styles.date}>{formatDate(post.created_at)}</span>
        </div>
        <h2 style={styles.title}>
          <Link to={`/posts/${post.id}`} style={styles.titleLink}>
            {post.title}
          </Link>
        </h2>
        <p style={styles.excerpt}>
          {post.content.length > 160
            ? post.content.slice(0, 160) + '...'
            : post.content}
        </p>
        <div style={styles.footer}>
          <span style={styles.author}>por {post.author_name}</span>
          <Link to={`/posts/${post.id}`} style={styles.readMore}>
            Ler mais →
          </Link>
        </div>
      </div>
    </article>
  );
}

const styles = {
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  imgWrapper: { height: '200px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  body: { padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  meta: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  date: { fontSize: '0.8rem', color: 'var(--muted)' },
  title: { fontFamily: 'var(--font-display)', fontSize: '1.4rem', lineHeight: 1.2, letterSpacing: '0.02em' },
  titleLink: { color: 'var(--white)', transition: 'color 0.2s' },
  excerpt: { fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6, flex: 1 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  author: { fontSize: '0.8rem', color: '#666' },
  readMore: { fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 },
};
