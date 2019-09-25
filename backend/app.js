require('dotenv').config();

const express = require('express');
const database = require('./helpers/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));


app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const port = process.env.LISTEN_PORT;
app.listen(port, async () => {
    await database.establishConnection();
    console.log(`Backend app listening on port ${port}`);
});
