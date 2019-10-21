require('dotenv').config();

const express = require('express');
const database = require('./helpers/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/article',require('./routes/article'));
app.use('/stock',require('./routes/stock'));
app.use('/profile', require('./routes/profile'));
app.use('/portfolio',require('./routes/portfolio'));
app.use('/event',require('./routes/event'));

const port = process.env.PORT;
app.listen(port, async () => {
    await database.establishConnection();
    console.log(`Backend app listening on port ${port}`);
});
