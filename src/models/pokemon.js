const Type = require("./type")

class BasePokemon {

  constructor() {
    this.baseHp = 72
    this.baseAtk = 18
  }
}

class Pokemon extends BasePokemon {

  constructor(id, name, types, hp, atk) {
    super()
    this.id = id
    this.name = name
    this.types = types.map(t => new Type(t.id, t.name, t.hp, t.atk))
    this.hp = hp
    this.atk = atk
  }

  getHp() {
    return this.baseHp + this.hp + this.types.reduce((acum, t) => acum + t.hp, 0)
  }
  
  getAtk() {
    return this.baseAtk + this.atk + this.types.reduce((acum, t) => acum + t.atk, 0)
  }
}

module.exports = Pokemon