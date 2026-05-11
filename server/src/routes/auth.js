const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (rota protegida)
router.get('/me', authMiddleware, me);

// POST /api/auth/logout  (no JWT stateless, o logout é client-side)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout realizado. Remova o token no cliente.' });
});

module.exports = router;
