
var express = require('express');
var path = require('path');
var fs = require('fs');
const { SSL_OP_TLS_ROLLBACK_BUG } = require('constants');

var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
const { url } = require('inspector');
var app = express();

var host_name = '127.0.0.1';
var port_number = 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Define the routes to get the required resources for the browser,
// These are the header functions that respond when specific URLs are hit either 
// automatically by the browser or by user entry.
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
// ------------------------------------------------------------------------------------------------
// This is an api route to respond to the URL /get-profile sent by the browser, it interogates 
// the mongo-db and sends back the body retrieved as a bunch of JSON. It sends this to the console
// just so that you can correlate what the server is doing with what the browser is recieving.
// ------------------------------------------------------------------------------------------------
app.get('/get-profile', function (req, res) {
    var response = res;
    var userObj = req.body;
    console.log('The user object received from client', userObj);

    MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) {
        if (err) {
            console.log('Error in /get-profile');
            throw err;                          // this is quick and dirty at the moment because there aint a catch block
        }
        console.log('Connecting to the database');

        var db = client.db('user-account');
        var query = {userid: 1};

        db.collection('users').findOne(query, function (err, result) {
            if (err) throw err;
            client.close();
                    console.log(result);
            response.send(result);
        });
    })
});
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
app.post('/update-profile', function (req, res) {
    var userObj = req.body;
    var response = res;

    // userObj is the object that gets transferred from the client 
    console.log('Connecting to the database WITH',userObj);

    MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) {
        if (err) {
            console.log('Error in /update-profile <<<<<<<<<<>>>>>>>>>>>>>>');
            throw err;                          // this is quick and dirty at the moment because there aint a catch block
        }               
        
        var db = client.db('user-account');
        userObj['userid'] = 5;
        var query = {userid: 5};
        var newValues = { $set: userObj };

        console.log('Successfully connected to the user-account database');
        db.collection('users').findOne(query, function (err, result) {
            if (err) throw err;
                console.log(result);
        });
        db.collection('users').updateOne(query, newValues, {upsert: true}, function (err, res) {
            if (err) throw err;                  // this is quick and dirty at the moment because there aint a catch block
            console.log('Successfully updated or inserted the item');
            client.close();
                console.log(userObj);   
            response.send(userObj);
        });
    });
});
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
app.get('/profile-picture', function(req, res) {
    
    var img = fs.readFileSync('img/pic01.jpg');
    res.writeHead(200, {'Content-Type':'image/jpg'});
    res.end(img, 'binary');

});
// ------------------------------------------------------------------------------------------------
// THe compnonet that 'Listens' on port and hostname given. Note the different quotes here, on an 
// XPS-15 keyboard these quotes are those to the immediate left of the "1" key NOT the ones under 
// the @ key.
// ------------------------------------------------------------------------------------------------
app.listen(port_number, host_name, function () {
    console.log(`This line is FFFreaky Node Server running on http://${host_name}:${port_number}/`);

});

