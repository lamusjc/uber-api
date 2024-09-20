"use strict";
const fs = require('fs');
const bcrypt = require("bcryptjs");
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};
  var role_id = req.body.role_id;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var password = req.body.password;
  var address = req.body.address || null;
  var coords = req.body.coords || null;
  var users_photo = req.body.users_photo;
  var vehicle_brand = req.body.vehicle_brand || null;
  var vehicle_year = req.body.vehicle_year || null;
  var vehicle_license = req.body.vehicle_license || null;
  var vehicle_color = req.body.vehicle_color || null;
  var users_accepted = role_id == 3 ? false : true;
  var url = null;

  const schema = {
    role_id: {
      type: "number",
      optional: false,
    },
    firstname: {
      type: "string",
      optional: false,
      max: 20,
    },
    lastname: {
      type: "string",
      optional: false,
      max: 20,
    },
    username: {
      type: "string",
      pattern: new RegExp(
        "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$"
      ),
      optional: false,
      max: 100,
    },
    password: { type: "string", min: 1, max: 60, optional: false },
    users_address: { type: "string", min: 1, max: 100, optional: true },
    users_coords: { type: "string", min: 1, max: 10000, optional: true },
    users_photo: { type: "string", optional: true },
    vehicle_brand: { type: "string", min: 0, max: 100, optional: true },
    vehicle_year: { type: "string", min: 0, max: 10, optional: true },
    vehicle_license: { type: "string", min: 0, max: 100, optional: true },
    vehicle_color: { type: "string", min: 0, max: 100, optional: true },
    users_accepted: { type: "string", min: 1, max: 100, optional: true },
  };

  const check = _validator.compile(schema);

  if (
    check({
      role_id: Number(req.body.role_id),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username.toLowerCase().trim(),
      password: req.body.password,
      address: req.body.address,
      coords: req.body.coords,
      users_photo: req.body.users_photo,
      vehicle_brand: req.body.vehicle_brand,
      vehicle_year: req.body.vehicle_year,
      vehicle_license: req.body.vehicle_license,
      vehicle_color: req.body.vehicle_color,
    }) !== true
  ) {
    let validaciones = check({
      role_id: Number(req.body.role_id),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username.toLowerCase().trim(),
      password: req.body.password,
      address: req.body.address,
      coords: req.body.coords,
      users_photo: req.body.users_photo,
      vehicle_brand: req.body.vehicle_brand,
      vehicle_year: req.body.vehicle_year,
      vehicle_license: req.body.vehicle_license,
      vehicle_color: req.body.vehicle_color,
    });
    let message = "";
    validaciones.map((value, i) => {
      if (i == validaciones.length - 1) {
        message = message + value.field;
      } else {
        message = message + value.field + ", ";
      }
    });
    response = {
      data: validaciones,
      message: `Error validators fields: ${message}. Verify!`,
      status: 400,
    };
    res.status(response.status);
    return res.json(response);
  } else {
    if (!users_photo) {
      register();
    } else {
      var base64Image = users_photo.split(";base64,").pop();
      var date = Date.now();
      var url_register = "uploads/images/" + date + ".png";
      fs.writeFile(url_register, base64Image, { encoding: "base64" }, function (
        err,
        data
      ) {
        url = "images/" + date + ".png";
        register();
      });
    }
    function register() {
      var query =
        "INSERT INTO users(role_id, users_firstname, users_lastname, users_username, users_password, users_address, users_coords, users_photo, users_vehicle_brand, users_vehicle_year, users_vehicle_license, users_vehicle_color, users_status, users_accepted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

      var query2 = "SELECT *FROM USERS where users_username = ?";

      //Verificamos si el usuario existe o no
      connection.query(query2, [username], function (error, result, fields) {
        if (error) {
          response = {
            status: 500,
            message: "Unknown Error",
          };
          res.status(response.status);
          return res.json(response);
        } else {
          //Preguntamos si esta vacio, si lo esta lo registra
          if (result.length == 0) {
            connection.query(
              query,
              [
                role_id,
                firstname,
                lastname,
                username,
                bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                address,
                coords,
                url,
                vehicle_brand,
                vehicle_year,
                vehicle_license,
                vehicle_color,
                true,
                users_accepted,
              ],
              function (error, result, fields) {
                if (error) {
                  response = {
                    status: 500,
                    message: "Error Interno del Servidor",
                  };
                  res.status(response.status);
                  return res.json(response);
                } else {
                  response = {
                    status: 200,
                    message: "Registered User!",
                  };
                  res.status(response.status);
                  return res.json(response);
                }
              }
            );
            //Si es mayor a 0, quiere decir que hay datos guardados
          } else {
            response = {
              status: 409,
              message: "Users exists",
            };
            res.status(response.status);
            return res.json(response);
          }
        }
      });
    }
  }
};
