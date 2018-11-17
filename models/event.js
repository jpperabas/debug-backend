'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var event_schema = schema({
	event_type: String,
	date: String,
	main_issue: String,
	observations: String,
	completed: Boolean,
	property: {type: schema.ObjectId, ref: 'property'},
	user: {type: schema.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('event', event_schema);