var Rdio = require('node-rdio');

var rdio = new Rdio (["7y99z5fsvj62xrsrgendtr94", "pCggXYPRzt"]);
exports.searchRdio = function(query, callback) {

	var params = {
	    query    : query,
	    types    : 'track'
	};
	
	rdio.call('search', params, function (err, data) {
		callback(err, data);
	});
};