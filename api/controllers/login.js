"use strict";
const bcrypt = require("bcryptjs");
const Validator = require("fastest-validator");
const jwt = require('jsonwebtoken');
const config = require("../../config/config");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};

  const schema = {
    username: {
      type: "string",
      pattern: new RegExp(
        "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$"
      ),
      optional: false,
      max: 100,
    },
    password: { type: "string", min: 1, max: 60, optional: false },
  };

  const check = _validator.compile(schema);

  if (
    check({
      username: req.body.username.toLowerCase().trim(),
      password: req.body.password,
    }) !== true
  ) {
    let validaciones = check({
      username: req.body.username.toLowerCase().trim(),
      password: req.body.password,
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
    var username = req.body.username.toLowerCase().trim();
    var password = req.body.password;

    var query =
      "SELECT *FROM users " +
      "INNER JOIN role ON users.role_id = role.role_id " +
      "WHERE users_username = ?";

    connection.query(query, [username], function (error, result, fields) {
      if (error) {
        response = {
          status: 500,
          message: "Internal Server Error",
        };
        res.status(response.status);
        return res.json(response);
      } else {
        if (result.length > 0) {
          if (result[0].users_accepted) {

            if (bcrypt.compareSync(password, result[0].users_password)) {
              const token = jwt.sign(
                {
                  users_id: result[0].users_id,
                  username: req.body.username,
                  role_id: result[0].role_id,
                  role_name: result[0].role_name,
                },
                config.secret,
                {
                  algorithm: "HS256",
                  expiresIn: 60 * 60 * 24,
                }
              );
              req.session.users_id = result[0].users_id;
              req.session.save();

              response = {
                status: 200,
                message: "Success",
                data: {
                  token,
                  users_id: result[0].users_id,
                  username: result[0].users_username,
                  role_id: result[0].role_id,
                  role_name: result[0].role_name,
                },
              };

              res.status(response.status);
              return res.json(response);
            } else {
              response = {
                status: 404,
                message: "Wrong password!",
              };
              res.status(response.status);
              return res.json(response);
            }
          } else {
            response = {
              status: 405,
              message:
                "You must wait for the authorization of the administrator!",
            };

            res.status(response.status);
            return res.json(response);
          }
        } else {
          response = {
            status: 403,
            message: "User doesn't exists!",
          };
          res.status(response.status);
          return res.json(response);
        }
      }
    });

    console.log("Metodo POST-LOGIN realizado.");
  }
};
