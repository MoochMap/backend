var MongoClient	= require('mongodb').MongoClient;
var bcrypt			= require('bcrypt');
var config			= require('../../../config');
var url					= config.database;
var jwt					= require('jsonwebtoken');

function createAccount(body, db, res) {
	var collection = db.collection('users');
	bcrypt.hash(body.password, 10, function (err, hash) {
		var user = {
			username: body.username,
			password: hash
		};
		collection.insert(user, function(err, result) {
			if (err) {
				return res.json({ success: false, message: 'Database error' });
			} else {
				return res.json({ success: true, message: 'Sucessfully registered!' });
			}
		});
	});
}

var signup = function(req,res) {
	if (!req.body.username || !req.body.password) {
		return res.json({ success: false, message: "Invalid Information" });
	}

	MongoClient.connect(url, function(err, db) {
		if (err) {
			return res.json({ success: false, message: err });
		}
		var collection = db.collection('users');
		collection.find({ username: req.body.username }).toArray( function(err, docs) {
			if (docs.length === 0) {
				createAccount(req.body, db, res);
			} else {
				return res.json({ success: false, message: 'Username already exists' });
			}
		});
	});	
};

var login = function (req,res) {
	if (!req.body.username || !req.body.password) {
		return res.json({ success: false, message: 'Invalid login information' });
	}
	
	MongoClient.connect(url, function (err, db) {
		try {
			var collection = db.collection('users');
			collection.find({ username: req.body.username }).toArray( function(err, docs) {
				if (docs.length === 0) {
						return res.json({ success: false, message: 'Invalid username' });
				} else {
					var user = docs[0];
					bcrypt.compare(req.body.password, user.password, function (err, match) {
						if (!match) {
							return res.json({ success: false, message: 'Invalid password' });
						} else {
							var tokenitems = {
								_id: user._id,
								username: req.body.username
							}
							var token = jwt.sign( tokenitems , config.secret, {
								expiresIn: 86400
							});
							return res.json({ success: true, message: 'Successfully logged in', token: token });
						}
					});
				}
			});
		} catch (error) {
			return res.json({ success: false, message: 'Database Error' });
		}	
	});	
};

var authenticate = function (req, res, next) {
	var token = req.header('token');

	if (!token) {
		return res.send({ success: false, message: 'No token provided' });
	}
	
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err) {
			return res.send({ success: false, message: 'Failed to authenticate token' });
		} else {
			req.decoded = decoded;
			next();
		}
	});
};

var functions = {
	login: login,
	signup: signup,
	authenticate: authenticate
};

module.exports = functions;
