
var express = require('express');
var path = require('path');
var fs = require('fs');
const global_id_counter = 0;
const { SSL_OP_TLS_ROLLBACK_BUG } = require('constants');

var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
const { url } = require('inspector');
const { ObjectId } = require('bson');
const { query } = require('express');
var app = express();
var global_userid;

var host_name = '127.0.0.1';
var port_number = 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/*------------------------------------------------------------------------------------------------
   Define the routes to get the required resources for the browser,
   These are the header functions that respond when specific URLs are hit either 
   automatically by the browser or by user entry.
   You do this first get.. and then the browser discovers from index.html that
   it needs: style.css, pic01.jpg and edit_save.js which it gets by initiating
   its own get requests these are the three that follow the initial get. Phew!!!
------------------------------------------------------------------------------------------------*/
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
    var userObj = JSON.stringify(req.query);
    let query = JSON.parse(userObj);

    console.log('-----------------------in app.get--------------------------------')
    console.log('The user object received from client', JSON.parse(userObj));


    query = JSON.parse(userObj);

    MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) 
    {
        if (err) 
        {
            console.log('Error in /get-profile');
            throw err;                          // this is quick and dirty at the moment because there aint a catch block
        }
        console.log('Connecting to the database with search token = ', query);

        var db = client.db('user-account');

        db.collection('users').findOne(query, function (err, result) 
        {
            if (err) throw err;
            client.close();
                    console.log('This is the result =', result);
                    console.log('this is result.userid =',result.userid);
                    global_userid = result.userid;
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
    console.log('-----------------------in app.post--------------------------------')
    console.log('Connecting to the database WITH',userObj);

    MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) 
    {
        if (err) 
        {
            console.log('Error in /update-profile <<<<<<<<<<>>>>>>>>>>>>>>');
            // this is quick and dirty at the moment because there aint a catch block
            throw err; 
        }               
        
        console.log('userObj.name=',userObj.name);
        console.log('global_userid =',global_userid);

        var db = client.db('user-account');
        userObj['userid'] = global_userid;
        var query = {userid: global_userid};
        var newValues = { $set: userObj };

        // this is the query to get the data item from the db if it exists
        console.log('Successfully connected to the user-account database with query =',query);
        db.collection('users').findOne(query, function (err, result) 
        {
            if (err) throw err;
                console.log(result);
        });

        // This is the query to upsert the contents of the item found above. The term upsert is update/insert.
        db.collection('users').updateOne(query, newValues, {upsert: true}, function (err, res) 
        {
            // this is quick and dirty at the moment because there aint a catch block
            if (err) throw err;
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

