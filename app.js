const express = require('express');
const app = express();
const userRoutes = require('./routes/auth');
require('dotenv/config');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { json } = require('body-parser');

app.use(bodyParser.json());

app.use('/', userRoutes);

mongoose.connect(process.env.CONNECTION, { useNewUrlParser: true }, () => 
console.log('connected')
);

app.listen(process.env.PORT || 3000);