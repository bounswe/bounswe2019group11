const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));

app.use('/stock', require('./routes/stock'));
app.use('/exchangerate', require('./routes/exchange_rate'));
app.use('/api/exchangerate', require('./routes/exchange_rate_api'));

app.get("/", (req, res) => {
  res.render('home');
});

app.listen(port, () => console.log(`Started on port ${port}`));
