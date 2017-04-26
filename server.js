var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
  host: 'db.imad.hasura-app.io',
  user: 'vpnydv10year',
  database: 'vpnydv10year',
  port : '5432',
  password: 'db-vpnydv10year-57200'
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

function createTemplate (data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
        <html>
            <head> 
                <title>${title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            <body>
                <div class="header"> 
                    <span class="head-btn"> <a href="/">Home</a> </span>
                    <span class="header-text">VPN's Blog</span> 
                    <span class = "head-btn"> Profile </span> 
                </div>

                <div class = "main">
                    <div class="bm bm-tl"></div>
                    <div class="bm bm-tr"></div>
                    <div class="bm bm-bl"></div>
                    <div class="bm bm-br"></div>
                    <div class="main-content">
                        <div class="article-heading"> ${heading} </div>
                        <div class="article-date"> ${date.toDateString()} </div>
                        <div class="article-content"> ${content} </div>
                        <div class="comment-section"> 
                            <h2> Comments </h2>
                            <div class = "comment"> 
                                <span class="comment-title">Anonymous User</span>
                                <div class = "comment-text"> 
                                    This is a comment, by some anonymous user.
                                </div>
                            </div>
                            <div class = "comment"> 
                                <span class="comment-title">Anonymous User 2</span>
                                <div class = "comment-text"> 
                                    This is a comment, by some anonymous user 2.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">All right reserved @ VPN</div>
            </body>
        </html>
        `;
    return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/login.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});


function hash (input, salt) {
    // How do we create a hash
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.post('/create-user', function(req, res){
    // username, password
    // {"username": "vipin", "password": "password"}
    // JSON request
    var username = req.body.username;
    var password = req.body.password;

    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)',[username, dbString], function (err, result){
        if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send('User successfully created:' + username);
        }
    });
});

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result){
        if (err) {
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                res.status(403).send('no data, username/password is invalid!');
            } else {
                // Match the password
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                // Creating a hash based on the password submitted and the origenal salt 
                var hashedPassword = hash(password, salt); 

                if (hashedPassword === dbString) {
                    res.status(200).send(username + ' successfully Logged in!');
                } else {
                    res.status(403).send('username/password is invalid!');
                }
            }
        }
    });
});



var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    // make a select request
    // return a response with the results
    pool.query('SELECT * FROM test', function(err, result){
        if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/ui/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));
});


var counter = 0;
app.get('/counter', function(req, res){
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/images/dev.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'dev.jpg'));
});

app.get('/ui/images/avatar.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'avatar.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

// Name List response
var names = [];
app.get('/submit-name', function(req, res){
    // Get the name from request;
    var name = req.query.name;

    names.push(name);
    // JSON: Javascript Object Notation
    res.send(JSON.stringify(names));  
});

app.get('/article/:articleName', function(req, res){
    // articleName == article-one

    // SELECT * FROM article WHERE title = '\; DELETE WHERE a = \'asdf'
    // using libreary to pass parameters to protect from sql-injection
    pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                res.status(404).send('Article not found');
            } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });    
});



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});


