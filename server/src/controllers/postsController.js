const pool = require('../config/db');

// ── GET /api/posts ────────────────────────────────────────────
async function getPosts(req, res) {
  const { category, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT p.id, p.title, p.content, p.category, p.image_url, p.created_at,
             u.id AS author_id, u.name AS author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
    `;
    const params = [];

    if (category) {
      query += ` WHERE p.category = $1`;
      params.push(category);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) FROM posts';
    const countParams = [];
    if (category) {
      countQuery += ' WHERE category = $1';
      countParams.push(category);
    }
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      posts: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
}

// ── GET /api/posts/:id ────────────────────────────────────────
async function getPostById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.content, p.category, p.image_url, p.created_at, p.updated_at,
             u.id AS author_id, u.name AS author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [id]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
}

// ── POST /api/posts ───────────────────────────────────────────
async function createPost(req, res) {
  const { title, content, category, image_url } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO posts (title, content, category, image_url, author_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, content, category || 'Geral', image_url || null, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
}

// ── PUT /api/posts/:id ────────────────────────────────────────
async function updatePost(req, res) {
  const { id } = req.params;
  const { title, content, category, image_url } = req.body;

  try {
    // Verificar se o post existe e pertence ao usuário
    const existing = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    if (existing.rows[0].author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para editar este post' });
    }

    const result = await pool.query(`
      UPDATE posts
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          category = COALESCE($3, category),
          image_url = COALESCE($4, image_url),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [title, content, category, image_url, id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
}

// ── DELETE /api/posts/:id ─────────────────────────────────────
async function deletePost(req, res) {
  const { id } = req.params;

  try {
    const existing = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    if (existing.rows[0].author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para deletar este post' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ message: 'Post deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
}

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
