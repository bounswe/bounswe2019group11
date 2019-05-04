const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;
// Load the variables in .env file to the process.env
dotenv.config();

const db = require('./helpers/db');
db.connect()
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
app.set('views', './views');

app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));

app.use('/stock', require('./routes/stock'));
app.use('/exchangerate', require('./routes/exchange_rate'));
app.use('/api/exchangerate', require('./routes/exchange_rate_api'));
app.use('/register', require('./routes/register'))

app.get("/", (req, res) => {
    res.render('home');
});

app.listen(port, () => console.log(`Started on port ${port}`));
