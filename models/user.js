"use strict";

var mongoose = require("mongoose");
var schema = mongoose.Schema;

var user_schema = schema({
  name: String,
  surname: String,
  phone: String,
  email: String,
  password: String,
  role: String,
  image: String
});

module.exports = mongoose.model("user", user_schema);
