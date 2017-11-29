var MongoClient	= require('mongodb').MongoClient;
var ObjectID    = require('mongodb').ObjectID;
var config			= require('../../../config');
var url					= config.database;

var getevents = function (req, res) {
	MongoClient.connect(url, function(err, db) {
		var events = db.collection('events');

		events.find({ }).toArray( function(err, docs) {
      if (docs.length === 0) {
        return res.json({ success: false, message: 'There aren\'t any events!' });
      } else {

        return res.json({ success: false, message: 'Found events!', events: docs });
      }
    });

	});
};

var createevent = function (req, res) {
	 MongoClient.connect(url, function(err, db) {
		var events = db.collection('events');

		var users = db.collection('users');
		users.findOne({ _id : new ObjectID(req.decoded._id) }, function (err, user) {
			if (err || !user) {
				return res.json({ success: false, message: "No user found" });
			} else {
				if (!req.body.name || !req.body.type || !req.body.location || !req.body.description || !req.body.start || !req.body.end) {
					return res.json({ success: false, message: 'Please fill in all fields!' });
				}
				var event = {
					name: req.body.name,
					description: req.body.description,
					locatiion: req.body.location,
					creator: user,
					type: req.body.type,
					start: req.body.start,
					end: req.body.end
				};

				events.find({ name: event.name }).toArray( function(err, docs) {
					if (docs.length === 0) {
						events.insert(event, function(err, result) {
				      if (err) {
				        return res.json({ success: false, message: 'Database error' });
				      } else {
				        return res.json({ success: true, message: 'Sucessfully created new event!' });
				      }
				    });
					} else {
						return res.json({ success: false, message: 'Event already exists!' });
					}
				});
			}
		});

	});
};

var followevent = function (req, res) {
	console.log(req.body.name);
	 MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
		var following;
		var name = req.body.name;

    /*users.findOne({ _id: new ObjectID(req.decoded._id) }, { following: { $elemMatch: { name } } }, function (err, user) {
      if (err) {
        return res.json({ success: false, message: "No user found" });
      }
*/
				users.findOne({ $and: [{ _id: new ObjectID(req.decoded._id) }, { following: {$elemMatch: {name: name } } } ] }, function (err, user) {
					if (err) {
						return res.json({ success: false, message: "DB Error" });
					}				
	
					if (!user) {
						users.update(
            { _id: new ObjectID(req.decoded._id) },
            { $push: { following: { "name": req.body.name } } }
          	);
          	following = "Unfollow";
					} else {
						users.update(
            { _id: new ObjectID(req.decoded._id) },
            { $pull: { following: { "name": req.body.name } } }
          	);
          	following = "Follow";
					}
					return res.json({ success: true, message: "Updated Following Status", following: following });
				});

//		});			
			
   });
};


var functions = {
	getevents: getevents,
	createevent: createevent,
	followevent: followevent
};

module.exports = functions;
