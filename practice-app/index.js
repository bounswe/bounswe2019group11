const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./helpers/db');

// Load the variables in .env file to the process.env
dotenv.config();

db
  .connect()
  .on('error', console.error)
  .on('disconnected', db.connect)
  .once('open', () => {
    app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`Listening on port: ${process.env.PORT}`);
});

app.use(bodyParser.text());
app.use(bodyParser.json({
  type: 'application/json'
}));
app.use(express.urlencoded({extended: true})) // req.body nin çalışması için gerekli

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('static'))

app.get("/", (req, res) => { res.send("Try /register") })
app.use('/register', require('./routes/register'))