var MongoClient	= require('mongodb').MongoClient;
var ObjectID    = require('mongodb').ObjectID;
var config			= require('../../../config');
var url					= config.database;

var getuser = function (req, res) {
	MongoClient.connect(url, function(err, db) {
		var users = db.collection('users');

		users.findOne({ _id : new ObjectID(req.decoded._id) }, function (err, user) {
			if (err || !user) {
				return res.json({ success: false, message: "No user found" });
			} else {
				console.log(user);
				return res.json({ success: true, message: "test", user: user, following: user.following });
			}
		});
		//return res.json({ success: false, message: "No user found" });
	});
};

var functions = {
	getuser: getuser

};

module.exports = functions;
