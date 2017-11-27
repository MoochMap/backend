var MongoClient	= require('mongodb').MongoClient;
var ObjectID    = require('mongodb').ObjectID;
var config			= require('../../../config');
var url					= config.database;

var getclasses = function (req, res) {
	MongoClient.connect(url, function(err, db) {
		var classes = db.collection('classes');

		classes.find({ }).toArray( function(err, docs) {
      if (docs.length === 0) {
        return res.json({ success: false, message: 'There aren\'t any classes!' });
      } else {

        return res.json({ success: false, message: 'Found classes!', classes: docs.map(function(item) { return item.classname;} ) });
      }
    });

	});
};

var createclass = function (req, res) {
	 MongoClient.connect(url, function(err, db) {
		var classes = db.collection('classes');
		var newclass = {
			classname: req.body.classname
		};
		classes.find({ classname: newclass.classname }).toArray( function(err, docs) {
			if (docs.length === 0) {
				classes.insert(newclass, function(err, result) {
		      if (err) {
		        return res.json({ success: false, message: 'Database error' });
		      } else {
		        return res.json({ success: true, message: 'Sucessfully created new class!' });
		      }
		    });
			} else {
				return res.json({ success: false, message: 'Class already exists' });
		}
	});
	});
};


var functions = {
	getclasses: getclasses,
	createclass: createclass
};

module.exports = functions;
