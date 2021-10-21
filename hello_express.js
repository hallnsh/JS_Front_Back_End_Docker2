// this code uses expres which must be installed

var express = require('express');
var path = require('path');
var fs = require('fs');
const { SSL_OP_TLS_ROLLBACK_BUG } = require('constants');
var app = express();

/*
const express = require('express');
const app = express();
*/
const port = 3000;
const host = '127.0.0.1';

app.get('/', (req, res) => {
    res.send('Hello from Expres()');
});

app.listen(port, host, () => {
    console.log('listening on  http://${host}:${port}/`');
});
