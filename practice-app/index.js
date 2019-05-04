const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('static'))
app.use(express.urlencoded({extended: true})) // req.body nin çalışması için gerekli

app.get("/", (req, res) => { res.send("Try /register") })
app.get('/register', function(req, res) {
  res.render("register")
})
app.post('/register', function(req, res) {
  console.log(req.body) // formdaki inputları bu şekilde alıyoruz
  // create database entry
})
app.listen(port, () => console.log('Listening here'))
app.use('/stock', require('./routes/stock'))