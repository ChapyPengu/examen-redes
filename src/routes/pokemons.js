var express = require('express');
var router = express.Router();
var fs = require('fs');
var fsp = require('fs/promises');
var path = require('path');
const Type = require('../models/type');
const Pokemon = require('../models/pokemon');

router.get('/', function (req, res, next) {
  const filePath = path.join(__dirname, '../data/pokemons.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json([]);
      }
      return res.status(500).json({ error: 'Error reading file' });
    }

    try {
      async function main() {
        const pokemons = JSON.parse(data);
        const typesPath = path.join(__dirname, '../data/types.json')
        const typesContent = await fsp.readFile(typesPath)
        const typesData = JSON.parse(typesContent)

        res.json(pokemons.map(p => {
          const typesFormat = p.types.map(t => typesData.find(td => td.name === t))
          if (typesFormat.includes(undefined))
            throw new Error('type not found')
          const instanceTypes = typesFormat.map(t => new Type(t.id, t.name, t.hp, t.atk))
          const instancePokemon = new Pokemon(p.id, p.name, instanceTypes, p.hp, p.atk)
          return {...instancePokemon, baseHp: undefined, baseAtk: undefined, types: instancePokemon.types.map(t => t.name)}
        }))
      }
      main()
    } catch (parseError) {
      res.status(500).json({ error: 'Error parsing JSON data' });
    }
  });
});

router.get('/type/:type', function (req, res, next) {
  const type = req.params.type;
  const filePath = path.join(__dirname, '../data/pokemons.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json([]);
      }
      return res.status(500).json({ error: 'Error reading file' });
    }

    try {
      const pokemons = JSON.parse(data);
      const filteredPokemons = [];
      for (let i = 0; i < pokemons.length; i++) {
        if (pokemons[i].type === type) {
          filteredPokemons.push(pokemons[i]);
        }
      }
      res.json(filteredPokemons);
    } catch (parseError) {
      res.status(500).json({ error: 'Error parsing JSON data' });
    }
  });
});

router.post('/', function (req, res, next) {
  const pokemon = req.body;
  const filePath = path.join(__dirname, '../data/pokemons.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Error reading file' });
    }

    let pokemons = [];
    if (data) {
      pokemons = JSON.parse(data);
    }

    pokemons.push(pokemon);
    fs.writeFile(filePath, JSON.stringify(pokemons, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to file' });
      }
      res.status(201).json(pokemon);
    });
  });
});

router.put('/:name', async (req, res) => {
  try {
    const name = req.params.name
    const file = path.join(__dirname, '../data/pokemons.json')
    const typesFile = path.join(__dirname, '../data/types.json')
    const typesContent = await fsp.readFile(typesFile)
    const typesData = JSON.parse(typesContent)
    let types = []
    const newTypes = req.body.types
    newTypes.forEach(type => {
      const typeFound = typesData.find(t => t.name === type)
      if (!typeFound)
        throw new Error('type not found')
      types.push(typeFound)
    })
    types = types.map(t => new Type(t.id, t.name, t.hp, t.atk))
    const content = await fsp.readFile(file)
    const pokemons = JSON.parse(content)
    const found = pokemons.find(p => p.name === name)
    found.types = types.map(t => t.name)
    await fsp.writeFile(file, JSON.stringify(pokemons))
    res.json(pokemons)
  } catch (e) {
    res.status(400)
  }
})

module.exports = router;
