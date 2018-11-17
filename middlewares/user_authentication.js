'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_para_jwt'

function authenticateUser(req, res, next){
	var headers = req.headers;

	if(headers.authorization){
		var token = headers.authorization.replace(/['"]+/g, '');
		try{
			var token_payload = jwt.decode(token, secret);
			if(token_payload.exp <= moment().unix()){
				return res.status(401).send({message: 'authenticateUser --> El token ha expirado'});
			}
		}catch(ex){
			console.log(ex);
			return res.status(500).send({message: 'authenticateUser --> Token no válido'});
		}

		req.user = token_payload;

		next();
	}else{
		return res.status(403).send({message: 'authenticateUser --> La petición no contiene el token de autenticación.'});
	}
};

module.exports = {
	authenticateUser
} 