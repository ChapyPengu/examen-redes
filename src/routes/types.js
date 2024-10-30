var express = require('express');
var router = express.Router();
var fs = require('fs/promises');
var path = require('path');
const Type = require('../models/type');

const PATH = path.join(__dirname, '../data/types.json')

router.post('/', async (req, res) => {
  try {
    const {
      name,
      hp,
      atk
    } = req.body
    if (!hp || hp < 0 || !atk || atk < 0)
      throw new Error('invalid hp or atk')
    const content = await fs.readFile(PATH)
    const types = JSON.parse(content)
    const newType = new Type(types.length, name, hp, atk)
    types.push(newType)
    res.json(newType)
  } catch (e) {
    res.status(400)
  }
})

module.exports = router;