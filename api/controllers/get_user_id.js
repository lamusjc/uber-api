"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

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
      users_id: Number(req.params.users_id),
    }) !== true
  ) {
    let validaciones = check({
      users_id: Number(req.params.users_id),
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
    var users_id = req.params.users_id;

    //   if (req.roleName !== "ADMIN") {
    //     response = {
    //       message: "You are not prepare for be admin!",
    //       status: 409,
    //     };
    //     res.status(response.status);
    //     return res.json(response);
    //   }
    var query = "SELECT *FROM users WHERE users_id = ?";

    connection.query(query, [users_id], (error, result, fields) => {
      if (error) {
        response = {
          message: "Internal Server Error!",
          status: 500,
        };
        res.status(response.status);
        return res.json(response);
      } else {
        delete result[0].users_password;
        response = {
          message: "Success!",
          status: 200,
          data: result,
        };
        res.status(response.status);
        return res.json(response);
      }
    });
  }
};
