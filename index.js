const connectToMongo=require('./db.js');
const express = require('express')
// import {connectToMongo} from './db.js'
connectToMongo();



const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

