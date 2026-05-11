import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoAccent}>⚡</span> SPORTS<span style={styles.logoBlog}>BLOG</span>
        </Link>

        {/* Links desktop */}
        <div style={styles.links}>
          <Link to="/" style={{
            ...styles.link,
            ...(location.pathname === '/' ? styles.linkActive : {})
          }}>Home</Link>

          {user ? (
            <>
              <Link to="/new-post" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                + Novo Post
              </Link>
              <span style={styles.userName}>Olá, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline"  style={{ fontSize: '0.85rem' }}>Entrar</Link>
              <Link to="/register" className="btn btn-primary"  style={{ fontSize: '0.85rem' }}>Cadastrar</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          style={styles.menuBtn}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >☰</button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={styles.drawer}>
          <Link to="/"          style={styles.drawerLink} onClick={() => setMenuOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link to="/new-post" style={styles.drawerLink} onClick={() => setMenuOpen(false)}>+ Novo Post</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={styles.drawerBtn}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={styles.drawerLink} onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link to="/register" style={styles.drawerLink} onClick={() => setMenuOpen(false)}>Cadastrar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(10,10,10,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #1f1f1f',
  },
  inner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '4.5rem',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    letterSpacing: '0.05em',
    color: 'var(--white)',
  },
  logoAccent: { color: 'var(--accent)' },
  logoBlog: { color: 'var(--accent)', marginLeft: '0.1em' },
  links: { display: 'flex', alignItems: 'center', gap: '1rem' },
  link: { color: 'var(--muted)', fontSize: '0.9rem', transition: 'color 0.2s' },
  linkActive: { color: 'var(--white)' },
  userName: { fontSize: '0.85rem', color: 'var(--muted)' },
  menuBtn: {
    display: 'none',
    background: 'none',
    color: 'var(--white)',
    fontSize: '1.5rem',
    '@media (max-width: 600px)': { display: 'block' },
  },
  drawer: {
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #1f1f1f',
    background: '#111',
  },
  drawerLink: { color: 'var(--white)', padding: '0.5rem 0', fontSize: '1rem' },
  drawerBtn: {
    background: 'none', color: 'var(--accent)',
    fontSize: '1rem', textAlign: 'left', padding: '0.5rem 0',
  },
};
