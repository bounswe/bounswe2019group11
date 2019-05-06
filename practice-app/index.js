require('dotenv').config({path: __dirname + '/.env'});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./helpers/db');
db
    .connect()
    .on('error', console.error)
    .on('disconnected', db.connect)
    .once('open', () => {
        console.log("Database connected");
});

app.use(bodyParser.text());
app.use(bodyParser.json({
    type: 'application/json'
}));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));

app.use('/stock', require('./routes/stock'));
app.use('/exchangerate', require('./routes/exchange_rate'));
app.use('/api/exchangerate', require('./routes/exchange_rate_api'));
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/logged_in', require('./routes/logged_in'))
app.use('/news',require('./routes/newsapi'))

app.get("/", (req, res) => {
    res.render('home');
});

app.listen(port, () => console.log(`Started on port ${port}`));

module.exports = app; // for testing

