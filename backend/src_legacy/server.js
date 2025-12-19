require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_PORT = process.env.PYTHON_PORT || 5000;

// Conectar ao Banco de Dados
connectDB();

app.use(cors());
app.use(express.json());

// --- PROXY PARA ANALISAVET ---
// Qualquer rota /api/analysis vai para o Python
app.use('/api/analysis', createProxyMiddleware({
  target: `http://localhost:${PYTHON_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/analysis': '/api/analysis',
  },
  onError: (err, req, res) => {
    console.error('Erro no Proxy Python:', err);
    res.status(502).json({ error: 'Serviço de Análise indisponível no momento.' });
  }
}));

// --- ROTAS DO SISTEMA PRINCIPAL ---
app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'VetSystem API', db: 'Connected' });
});

app.listen(PORT, () => {
  console.log(`🚀 Gateway VetSystem rodando na porta ${PORT}`);
  console.log(`🔌 Proxy para AnalisaVet configurado na porta ${PYTHON_PORT}`);
});
