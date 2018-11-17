"use strict";

var fs = require("fs");
var path = require("path");
var bcrypt = require("bcrypt-nodejs");
var user_model = require("../models/user");
var jwt = require("../services/jwt");

function register(req, res) {
  var user = new user_model();
  var body = req.body;

  if (body.name != null || body.surname != null || body.email != null) {
    user_model.findOne(
      { email: body.email.toLowerCase() },
      (err, matched_user) => {
        if (err) {
          res.status(500).send({
            message:
              "Sucedió un error inesperado al intentar recuperar los datos del usuario."
          });
        } else {
          if (matched_user) {
            res.status(403).send({
              message: "Ya existe un usuario registrado con este email."
            });
          } else {
            user.name = body.name;
            user.surname = body.surname;
            user.phone = null;
            user.email = body.email;
            user.role = "A1";
            user.image = null;
            if (body.password) {
              bcrypt.hash(body.password, null, null, function(err, hash) {
                user.password = hash;
                user.save((err, stored_user) => {
                  if (err) {
                    res.status(500).send({
                      message:
                        "Sucedió un error inesperado al intentar guardar el usuario."
                    });
                  } else {
                    if (stored_user) {
                      res.status(200).send({
                        message: "Se logró el registro del usuario.",
                        stored_user
                      });
                    } else {
                      res.status(500).send({
                        message:
                          "Sucedió un error inesperado al intentar guardar el usuario."
                      });
                    }
                  }
                });
              });
            } else {
              res
                .status(403)
                .send({ message: "Falta definir una contraseña." });
            }
          }
        }
      }
    );
  } else {
    res.status(403).send({ message: "Faltan datos." });
  }
}

function login(req, res) {
  var body = req.body;

  if (body.email != null || body.password != null) {
    var email = body.email;
    var password = body.password;

    user_model.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        res.status(500).send({
          message:
            "Sucedió un error inesperado al intentar recuperar los datos del usuario."
        });
      } else {
        if (user) {
          bcrypt.compare(password, user.password, (err, check) => {
            if (err) {
              res.status(500).send({
                message:
                  "Sucedió un error inesperado al intentar autenticar los datos del usuario."
              });
            } else {
              if (check) {
                res.status(200).send({
                  message: "Se logró el acceso a la cuenta.",
                  user,
                  token: jwt.createToken(user)
                });
              } else {
                res.status(404).send({
                  message:
                    "No empatan las credenciales con las que se está intentando acceder."
                });
              }
            }
          });
        } else {
          res.status(404).send({
            message:
              "No empatan las credenciales con las que se está intentando acceder."
          });
        }
      }
    });
  } else {
    res.status(401).send({ message: "Faltan datos." });
  }
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;

  user_model.findByIdAndUpdate(id, body, (err, updated_user) => {
    if (err) {
      res.status(500).send({
        message:
          "Sucedió un error inesperado al actualizar los datos del usuario."
      });
    } else {
      if (updated_user) {
        res.status(200).send({
          message: "Se logró la actualización de los datos del usuario.",
          updated_user
        });
      } else {
        res.status(404).send({
          message: "No se encontró el usuario que se intenta modificar."
        });
      }
    }
  });
}

function changeProfilePicture(req, res) {
  var id = req.params.id;
  var file_name = "image";
  console.log(req.files);
  if (req.files) {
    var file_path = req.files.image.path;
    var file_path_split = file_path.split("\\");
    var file_name = file_path_split[file_path_split.length - 1];
    var file_name_split = file_name.split(".");
    var file_ext = file_name_split[file_name_split.length - 1];

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      user_model.findByIdAndUpdate(
        id,
        { image: file_name },
        (err, updated_user) => {
          if (err) {
            res.status(500).send({
              message:
                "Sucedió un error inesperado al actualizar la imagen del usuario."
            });
          } else {
            if (updated_user) {
              res.status(200).send({
                message: "Se logró la actualización de la imágen.",
                updated_user
              });
            } else {
              res.status(404).send({
                message: "No se encontró el usuario que se intenta modificar."
              });
            }
          }
        }
      );
    } else {
      res
        .status(401)
        .send({ message: "La extensión del archivo no es compatible." });
    }
  } else {
    res.status(401).send({ message: "Falan datos." });
  }
}

function getImage(req, res) {
  var file_name = req.params.image;
  var file_path = "./uploads/images/" + file_name;

  fs.exists(file_path, exists => {
    if (exists) {
      res.sendFile(path.resolve(file_path));
    } else {
      res
        .status(404)
        .send({ message: "No se encontró la imagen que se intenta obtener." });
    }
  });
}

module.exports = {
  register,
  login,
  update,
  changeProfilePicture,
  getImage
};
