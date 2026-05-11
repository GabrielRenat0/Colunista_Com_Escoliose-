require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Populando banco de dados...');

    // ── Usuário admin ────────────────────────────────────────
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const userResult = await client.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `, ['Admin', 'admin@sportsblog.com', hashedPassword, 'admin']);

    const authorId = userResult.rows[0]?.id;
    if (!authorId) {
      console.log('ℹ️  Usuário admin já existe, pulando posts de seed.');
      return;
    }

    // ── Posts de exemplo ─────────────────────────────────────
    const posts = [
      {
        title: 'Brasil vence a Copa do Mundo pela 6ª vez!',
        content: 'Em uma partida histórica, a Seleção Brasileira conquistou o hexacampeonato mundial em uma final emocionante. O gol da vitória foi marcado nos acréscimos do segundo tempo, deixando todo o país em festa. Esta conquista encerra um jejum de mais de duas décadas e recoloca o Brasil no topo do futebol mundial.',
        category: 'Futebol',
        image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
      },
      {
        title: 'Fórmula 1: Temporada 2025 começa com surpresas',
        content: 'A abertura da temporada de Fórmula 1 trouxe grandes surpresas para os fãs. A corrida foi marcada por ultrapassagens emocionantes e uma virada inesperada no campeonato de construtores. As novas regulamentações aerdinâmicas parecem ter nivelado o campo, tornando a temporada mais disputada.',
        category: 'Automobilismo',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      },
      {
        title: 'NBA: Times favoritos ao título desta temporada',
        content: 'A temporada da NBA está chegando na reta final e as disputas nas conferências estão acirradas. Analistas apontam os grandes favoritos ao anel de campeão. O nível técnico desta temporada é considerado um dos mais altos da história da liga, com jovens talentos desafiando veteranos consagrados.',
        category: 'Basquete',
        image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      },
    ];

    for (const post of posts) {
      await client.query(`
        INSERT INTO posts (title, content, category, image_url, author_id)
        VALUES ($1, $2, $3, $4, $5);
      `, [post.title, post.content, post.category, post.image_url, authorId]);
    }

    console.log('✅ Seed concluído!');
    console.log('👤 Login: admin@sportsblog.com / admin123');
  } catch (err) {
    console.error('❌ Erro no seed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(() => process.exit(1));
