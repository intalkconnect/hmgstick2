const express = require('express');
const cors = require('cors');
const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');
const fs = require('fs');
const dayjs = require('dayjs');
const { generateNutJson } = require('./utils/nut');
const { addUser } = require('./utils/users');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  const credentials = basicAuth(req);

  if (!credentials) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Loja Tinfoil"');
    return res.status(401).send('Credenciais obrigatórias');
  }

  const users = JSON.parse(fs.readFileSync('./data/users.json'));
  const user = users[credentials.name];

  if (!user) return res.status(403).send('Usuário inválido');

  const valid = await bcrypt.compare(credentials.pass, user.hash);
  if (!valid) return res.status(403).send('Senha incorreta');

  if (dayjs().isAfter(dayjs(user.expira_em))) return res.status(403).send('Conta expirada');

  const nut = await generateNutJson();
  res.json(nut);
});


app.get('/games', (req, res) => {
  const games = JSON.parse(fs.readFileSync('./data/games.json'));
  res.json(games);
});

app.post('/users', async (req, res) => {
  const { username, password, plano } = req.body;
  if (!username || !password || !plano) return res.status(400).send('Campos obrigatórios');

  try {
    await addUser(username, password, plano);
    res.status(201).send('Usuário criado');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
