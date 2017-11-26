var express			= require('express');
var app					= express();
var port				= process.env.PORT || 5000;
var cors				= require('cors');
var bodyParser	= require('body-parser');
var routes			= require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', routes);

app.listen(port);
console.log("Server listening on port " + port);
