var MongoClient	= require('mongodb').MongoClient;
var ObjectID    = require('mongodb').ObjectID;
var config			= require('../config');
var url					= config.database;

var getposts = function (req, res) {
	MongoClient.connect(url, function(err, db) {
		var posts = db.collection('posts');

		posts.find({ classname: req.body.classname }).toArray( function(err, docs) {
      if (docs.length === 0) {
        return res.json({ success: false, message: 'There aren\'t any posts!' });
      } else {
        return res.json({ success: false, message: 'Received posts!', docs });
      }
    });

	});
};

var createpost = function (req, res) {
	 MongoClient.connect(url, function(err, db) {
		var posts = db.collection('posts');
		var newpost = {
			classname: req.body.classname,
      title: req.body.title,
      description: req.body.description
		};
		posts.insert(newpost, function(err, result) {
		  if (err) {
		    return res.json({ success: false, message: 'Database error' });
		  } else {
		    return res.json({ success: true, message: 'Sucessfully created new post!' });
		  }
		});
	});
};


var functions = {
	getposts: getposts,
	createpost: createpost
};

module.exports = functions;
