
/*
 * GET users listing.
 */

/* express default
exports.list = function(req, res){
  res.send("respond with a resource");
};
*/

exports.userlist = function(db) {
	return function(req, res) {
		db.collection('userlist').find().toArray(function(err, items) {
			res.json(items);
		});
	}
};

/*
 * POST to adduser.
 */

exports.adduser = function(db) {
	return function(req, res) {
		db.collection('userlist').insert(req.body, function(err, result) {
			res.send(
				(err === null) ? { msg: ''} : {msg: err }
			);
		});
	}
};

/*
 * DELETE adduser.
 */

exports.deleteuser = function(db) {
	return function(req, res) {
		var userToDelete = req.params.id;
		db.collection('userlist').removeById(userToDelete, function(err, result) {
			res.send(
				(result === 1) ? { msg: ''} : {msg: 'error: ' + err }
			);
		});
	}
};

