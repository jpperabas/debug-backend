'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3001;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/debug', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log('Se estableció conexión con la base de datos.')
		app.listen(port, (err, res) => {
			if(err){
				throw err;
			}else{
				console.log('Servidor del api rest escuchando en http://localhost:'+port)
			}
		});
	}
});