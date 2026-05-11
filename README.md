# ⚽ Colunista Com Escoliose

Blog esportivo fullstack com React, Node.js/Express e PostgreSQL.

## 🗂️ Estrutura do Projeto

```
sports-blog/
├── client/          # Front-end React
│   └── src/
│       ├── components/   # Componentes reutilizáveis
│       ├── pages/        # Páginas (Home, Login, NewPost)
│       ├── context/      # AuthContext (JWT)
│       └── services/     # Chamadas à API
├── server/          # Back-end Node.js/Express
│   └── src/
│       ├── routes/       # Rotas da API
│       ├── controllers/  # Lógica das rotas
│       ├── middleware/   # Auth JWT, etc.
│       ├── models/       # Queries SQL
│       └── config/       # DB, env
└── package.json     # Scripts do monorepo
```

## 🚀 Como rodar localmente

### 1. Pré-requisitos
- Node.js 18+
- PostgreSQL 14+

### 2. Instalar dependências
```bash
npm run install:all
```

### 3. Configurar banco de dados
```bash
# Criar banco no PostgreSQL
createdb sports_blog

# Rodar migrations
cd server && npm run migrate
```

### 4. Configurar variáveis de ambiente
```bash
cp server/.env.example server/.env
# Edite server/.env com suas credenciais
```

### 5. Rodar o projeto
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👤 Usuário de teste (seed)
- **Email:** admin@sportsblog.com
- **Senha:** admin123
