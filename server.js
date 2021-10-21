
var express = require('express');
var path = require('path');
var fs = require('fs');
const { SSL_OP_TLS_ROLLBACK_BUG } = require('constants');
var app = express();
var host_name = '127.0.0.1';
var port_number = 3000;

// Define the routes to get the required resources for the browser
// You do this first get.. and then the browser discovers from index.html that
// it needs: style.css, pic01.jpg and edit_save.js which it gets by initiating
// its own get requests these are the three that follow the initial get. Phew!!!
app.get('/', function(req, res) {
    console.log('path[',path.join(__dirname, '/html/index.html'),']');
    res.sendFile(path.join(__dirname, '/html/index.html'));
});

app.get('/img/pic01.jpg', function(req, res) {
    console.log('path[',path.join(__dirname, '/img/pic01.jpg'),']');
    res.sendFile(path.join(__dirname + '/img/pic01.jpg'));
});

app.get('/CSS/style.css', function(req, res) {
    console.log('path[',path.join(__dirname, '/CSS/style.css'),']');
    res.sendFile(path.join(__dirname + '/CSS/style.css'));
});

app.get('/js/edit_save.js', function(req, res) {
    console.log('path[',path.join(__dirname, '/js/edit_save.js'),']');
    res.sendFile(path.join(__dirname + '/js/edit_save.js'));
});

app.get('/icons/myicon.png', function(req, res) {
    console.log('path[',path.join(__dirname, '/icons/myicon.png'),']');
    res.sendFile(path.join(__dirname + '/icons/myicon.png'));
});

app.get('/profile-picture', function(req, res) {
    
    var img = fs.readFileSync('img/pic01.jpg');
    res.writeHead(200, {'Content-Type':'image/jpg'});
    res.end(img, 'binary');

});

app.listen(port_number, host_name, function () {
    console.log(`This line is FFFreaky Node Server running on http://${host_name}:${port_number}/`);

});

