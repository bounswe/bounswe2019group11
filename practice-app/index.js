// This file is like that just for testing purposes. I will update it after the reviews

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
const port = 3000;

dotenv.config();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));


app.use('/api/exchangerate', require('./routes/exchange_rate_api'));
app.use('/exchangerate', require('./routes/exchange_rate'));


const url = 'mongodb+srv://dbUser:Rku5ANPmO0t2srkw@mongotest-dnhun.mongodb.net/test?retryWrites=true';
mongoose.connect(url, {useNewUrlParser: true});
app.listen(port, () => console.log('...'));
