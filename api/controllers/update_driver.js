"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();
const fs = require("fs");

module.exports = function (req, res) {
  var response = {};
  const schema = {
    users_id: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      users_id: Number(req.body.users_id),
    }) !== true
  ) {
    let validaciones = check({
      users_id: Number(req.body.users_id),
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
    var users_id = req.body.users_id;
    var url = null;

    if (req.roleName !== "ADMIN") {
      response = {
        message: "You are not prepare for be admin!",
        status: 409,
      };
      res.status(response.status);
      return res.json(response);
    }

    var query = "UPDATE users SET users_accepted = true WHERE users_id = ?;";

    connection.query(
      query,
      [users_id],
      (error, result, fields) => {
        if (error) {
          response = {
            message: "Internal Server Error!",
            status: 500,
          };
          res.status(response.status);
          return res.json(response);
        } else {
          response = {
            message: "Driver accepted!",
            status: 200,
          };
          res.status(response.status);
          return res.json(response);
        }
      }
    );
  }
};
