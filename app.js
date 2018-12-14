const express = require('express');
const fs = require('fs');
const tableRouter = require('./api/table');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/',express.static( 'src'));

app.use('/table', tableRouter);
app.listen('3000');


console.log("go to http://localhost:3000");