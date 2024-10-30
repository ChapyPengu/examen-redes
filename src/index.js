const app = require('./app')

/*
  se necesita poder extender los tipos de cada pokemon el cual
  contenga una vida base y un ataque base que se suma al ataque adicional del pokemon,
  los tipos los tengo que poder agregar con un metedo, el tipo modifica el ataque y la vida del pokemon,
  persistencia
*/

app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'))
})