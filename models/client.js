'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var client_schema = schema({
	name: String,
	surname_1: String,
	surname_2: String,
	phone: String,
	email: String,
	registration_date: Date,
	user: {type: schema.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('client', client_schema);