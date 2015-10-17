
var PORT = process.env.PORT || 3000;
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

app.use(bodyParser.json());
//app.use(methodOverride);
app.use(express.static(path.join(__dirname, '../app')));
var env = process.env.NODE_ENV || 'development';
var routing = require("./routing")(app);

var server = http.Server(app);
server.listen(PORT, function() {
    console.log("SERVER LISTEN ON PORT:", PORT);
});

