const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const contractRoute = require('./routes/contractRoute');
const balanceRoute = require('./routes/balanceRoute');
const jobsRoute = require('./routes/jobRoute');
const adminRoute = require('./routes/adminRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));
app.use('/contracts', contractRoute);
app.use('/balances', balanceRoute);
app.use('/jobs', jobsRoute);
app.use('/admin', adminRoute);

module.exports = app;
