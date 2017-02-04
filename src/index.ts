'use strict'

import app from './core'

app.get('/', (req, res) => {
  res.write('<h1>Hello world</h1>')
  res.end()
})

app.listen(3000)
