const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const indexRouter = require('./routes/index')
const pokemonsRouter = require('./routes/pokemons')
const typesRouter = require('./routes/types')

const app = express()
const PORT = process.env.PORT ?? 3000

app.set('port', PORT)

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/pokemons', pokemonsRouter)
app.use('/types', typesRouter)

module.exports = app
