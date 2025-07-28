const fs = require('fs');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');

const planos = {
  teste: 1,
  '30d': 30,
  '6m': 180,
  '12m': 365
};

async function addUser(username, password, plano) {
  if (!planos[plano]) throw new Error('Plano inválido');
  const usersPath = './backend/data/users.json';
  const users = JSON.parse(fs.readFileSync(usersPath));

  const hash = await bcrypt.hash(password, 10);
  const expira_em = dayjs().add(planos[plano], 'day').toISOString();

  users[username] = { hash, expira_em, tipo: plano };

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

module.exports = { addUser };
