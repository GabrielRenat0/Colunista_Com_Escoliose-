require('dotenv').config();
const pool = require('./db');

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('⏳ Rodando migrations...');

    // ── Tabela: users ────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100)        NOT NULL,
        email      VARCHAR(150) UNIQUE NOT NULL,
        password   VARCHAR(255)        NOT NULL,
        role       VARCHAR(20)         NOT NULL DEFAULT 'user',
        created_at TIMESTAMP           NOT NULL DEFAULT NOW()
      );
    `);

    // ── Tabela: posts ────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id         SERIAL PRIMARY KEY,
        title      VARCHAR(255)  NOT NULL,
        content    TEXT          NOT NULL,
        category   VARCHAR(100)  NOT NULL DEFAULT 'Geral',
        image_url  VARCHAR(500),
        author_id  INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP     NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP     NOT NULL DEFAULT NOW()
      );
    `);

    console.log('✅ Migrations concluídas!');
  } catch (err) {
    console.error('❌ Erro nas migrations:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(() => process.exit(1));
