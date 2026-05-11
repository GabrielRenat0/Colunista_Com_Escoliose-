const express = require('express');
const router = express.Router();
const {
  getPosts, getPostById, createPost, updatePost, deletePost
} = require('../controllers/postsController');
const { authMiddleware } = require('../middleware/auth');

// GET  /api/posts          - listar posts (público)
router.get('/', getPosts);

// GET  /api/posts/:id      - ver post (público)
router.get('/:id', getPostById);

// POST /api/posts          - criar post (autenticado)
router.post('/', authMiddleware, createPost);

// PUT  /api/posts/:id      - editar post (autenticado)
router.put('/:id', authMiddleware, updatePost);

// DELETE /api/posts/:id   - deletar post (autenticado)
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
