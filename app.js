var express			= require('express');
var app					= express();
var cors				= require('cors');
var bodyParser	= require('body-parser');
var routes			= require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', routes);

app.listen(process.env.PORT || 5000);
console.log("Server listening on port 5000");
