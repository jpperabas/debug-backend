"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_secreta_para_jwt";

function createToken(user) {
  var payload = {
    sub: user.id,
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment()
      .add(2, "hours")
      .unix()
  };
  return jwt.encode(payload, secret);
}

module.exports = {
  createToken
};
