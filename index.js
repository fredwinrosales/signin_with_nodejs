var express = require('express');

var portal = require('./routes/portal');
var apis = require('./routes/apis');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

app.use('/', portal);
app.use('/api/v1/', apis);

app.listen(3000);
console.log('3000 is the magic port');