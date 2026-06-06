const express = require('express')
const app = express()
const port = 5174

const _url = 'http://localhost:'
const _href = '/login'

// Define a route for GET requests to the root URL
app.get(_href, (req, res) => {
  res.send('Hello World from Express!')
})





// Start the server
app.listen(port, () => {
  console.log(`App listening at ${_url + port + _href}`)
})
