"use strict";

var express = require("express");
var body_parser = require("body-parser");

var app = express();

//Aquí se cargan las rutas
var user_routes = require("./routes/user");
var client_routes = require("./routes/client");

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

//Aquí se configuran cabeceras http

//Aquí se cargan las rutas base

app.use("/user", user_routes);
app.use("/client", client_routes);

module.exports = app;
