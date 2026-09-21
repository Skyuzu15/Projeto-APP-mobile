const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
// Aumenta o limite para aceitar imagens Base64 grandes (Tech Forge)
app.use(express.json({ limit: '10mb' })); 

// Configuração do Multer (Tech Forge - Memória)
// Usamos memoryStorage porque o app envia Base64 como texto.
// O Multer faz o parse do formulário para nós.
const upload = multer();

// Rota de Upload (Tech Forge - Adaptado para Base64)
app.post('/upload', upload.single('image_base64'), (req, res) => {
  console.log('Requisição de upload recebida!');
  
  // Pega o Base64 do corpo da requisição (seja via JSON ou FormData)
  const base64String = req.body.image_base64;

  if (!base64String) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
  }

  try {
    // Remove o cabeçalho do base64 (ex: "data:image/jpeg;base64,")
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    
    // Converte de volta para binário
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Cria um nome único para o arquivo
    const filename = `foto_${Date.now()}.jpg`;
    const filepath = path.join(__dirname, 'uploads', filename);
    
    // Salva o arquivo na pasta uploads
    fs.writeFileSync(filepath, buffer);
    
    console.log('Arquivo salvo com sucesso:', filename);
    res.json({ message: 'Upload realizado com sucesso!', file: filename });
    
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    res.status(500).json({ error: 'Erro interno ao salvar imagem.' });
  }
});

// Controle de Usuário (Admin vs User) - Simulado
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@rastrolote.com') {
    return res.json({ role: 'admin', token: 'fake-jwt-admin' });
  } else if (email === 'operador@rastrolote.com') {
    return res.json({ role: 'user', token: 'fake-jwt-user' });
  }
  res.status(401).json({ error: 'Credenciais inválidas' });
});

app.listen(3000, () => console.log('Backend rodando na porta 3000'));