'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var property_schema = schema({
	property_type: String,
	physical_characteristics: {
		sqr_mts_contruction: Number,
		sqr_mts_land: Number,
	},
	spaces: {
		bedrooms: Number,
		bathrooms: Number,
		water_closets: Number,
		balconies: Number,
		fronts: Number,
		floors: Number,
		kitchen: Boolean,
		living_room: Boolean,
		dinning_room: Boolean,
		breakfast_nook: Boolean,
		entrance_hall: Boolean,
		garden: Boolean,
		terrace: Boolean,
		roof_garden: Boolean,
		laundry_room: Boolean,
		laundry_yard: Boolean,
		garage: Boolean,
		swimming_pool: Boolean,
		study_room: Boolean,
		playroom: Boolean
	},
	adress: {
		street: String,
		ext_number: String,
		int_number: String,
		neighborhood: String,
		city: String,
		state: String,
		country: String,
		location_pin: String
	},
	full_service_duration: Number,
	full_service_quotation: Number,
	full_service_price: Number,
	client: {type: schema.ObjectId, ref: 'client'} 
});

module.exports = mongoose.model('property', property_schema);