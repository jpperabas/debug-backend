'use strict';

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var jwt = require('jwt-simple');
var secret = 'clave_secreta_para_jwt';
var mongoosePagination = require('mongoose-pagination');

var user_model = require('../models/user');
var client_model = require('../models/client');
var property_model = require('../models/property');
var event_model = require('../models/event');

function register(req, res){
	var client = new client_model();
	
	var headers = req.headers;
	var body = req.body;
	var token = headers.authorization.replace(/['"]+/g, '');
	try{
		var token_payload = jwt.decode(token, secret);
	}catch(ex){
		console.log(ex);
		return res.status(500).send({message: 'Token no válido'});
	}

	if(body.name != null || body.surname_1 != null || body.surname_2 != null || body.phone != null || body.email != null){
		client_model.findOne({$or: [{email: body.email.toLowerCase()},{phone: body.phone}]}, (err, matched_user) => {
			if(err){
				res.status(500).send({message: 'Sucedió un error inesperado al intentar recuperar los datos del cliente.'});
			}else{
				if(matched_user){
					res.status(403).send({message: 'Ya existe un cliente registrado con este email y/o teléfono.'});
				}else{
					client.name = body.name;
					client.surname_1 = body.surname_1;
					client.surname_2 = body.surname_2;
					client.phone = body.phone;
					client.email = body.email;
					client.registration_date = moment().unix();
					client.user = token_payload.sub;

					client.save((err, stored_client) => {
						if(err){
							res.status(500).send({message: 'Sucedió un error inesperado al intentar guardar el cliente.'});
						}else{
							if(stored_client){
								res.status(200).send({message: 'Se logró el registro del cliente.', stored_client});
							}else{
								res.status(500).send({message: 'Sucedió un error inesperado al intentar guardar el cliente.'});
							}
						}
					});
				}
			}
		});
	}else{
		res.status(403).send({message: 'Faltan datos.'});
	}
};

function getOne(req, res){
	var id = req.params.id;

	client_model.findById(id, (err, found_client) => {
		if(err){
			res.status(500).send({message: 'Sucedió un error inesperado al intentar recuperar los datos del cliente.'});
		}else{
			if(found_client){
				res.status(200).send({message: 'Se logró la recuperación de los datos del cliente.', found_client});
			}else{
				res.status(404).send({message: 'No se encontraron los datos del cliente que se intenta recuperar.'});
			}
		}
	});
};

function getAll(req, res){
	var params = req.params;
	if(params.page){
		var page = Number(params.page);
	}else{
		var page = 1;
	}
	var items_per_page = Number(params.items_per_page);
	var sorting_field = params.sorting_field;

	client_model.find().sort(sorting_field).paginate(page, items_per_page, (err, listed_clients, total_items) => {
		if(err){
			res.status(500).send({err, message: 'Sucedió un error inesperado al intentar listar los clientes.'});
		}else{
			if(listed_clients){
				res.status(200).send({
					listed_clients,
					total_items
				});
			}else{
				res.status(404).send({message: 'No se encontraron los clientes que se intenta recuperar.'});
			}
		}
	});
};

function update(req, res){
	var id = req.params.id;
	var body = req.body;

	client_model.findByIdAndUpdate(id, body, (err, updated_client) => {
		if(err){
			res.status(500).send({message: 'Sucedió un error inesperado al actualizar los datos del cliente.'});
		}else{
			if(updated_client){
				res.status(200).send({message: 'Se logró la actualización de los datos del cliente.', updated_client});
			}else{
				res.status(404).send({message: 'No se encontró el cliente que se intenta modificar.'});
			}
		}
	});
};

/*

function del(req, res){
    var id = req.params.id;
    
    client_model.findByIdAndRemove(id, (err, removed_client) => {
        if(err){
			res.status(500).send({message: 'Sucedió un error inesperado al intentar eliminar al cliente.'});
		}else{
            if(removed_client){
				res.status(200).send({message: 'Se logró eliminar el cliente.', removed_client});
			}else{
				res.status(404).send({message: 'No se pudo eliminar el cliente.'});
			}
        }
    });
};

*/

module.exports = {
	register,
    getOne,
	getAll,
	update,
    /*
    
    del
    
    */
};