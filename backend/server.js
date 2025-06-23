require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Configuração melhorada do CORS (mantenha como está)
app.use(cors({
  origin: ['http://localhost:5173', 'https://system-login-lab.vercel.app'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Middleware de log para todas as requisições (mantenha)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Suas rotas existentes (mantenha na ordem que preferir)
app.use('/api/auth', authRoutes);  // ← Esta linha você já tinha, perfeito!

// Rota de teste básica (mantenha)
app.get("/api/teste", (req, res) => {
  res.json({ message: "API funcionando!", status: "OK" });
});

// **************** ADIÇÃO OPCIONAL ****************
// Middleware de erro (recomendado adicionar)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});
// *************************************************

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: https://system-login-lab.onrender.com/api/teste`);
});