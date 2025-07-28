const fs = require('fs');

async function generateNutJson() {
  const games = JSON.parse(fs.readFileSync('./data/games.json'));

  const titles = games.map(g => ({
    id: g.id,
    name: g.name,
    url: g.url,
    image_url: g.thumbnail_url
  }));

  return {
    name: 'Loja Megazord',
    title: 'Loja Megazord',
    type: 'http',
    titles
  };
}

module.exports = { generateNutJson };
