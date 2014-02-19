
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
		})
	}
};

