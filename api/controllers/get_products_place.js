"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};

  const schema = {
    place_id: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      place_id: Number(req.params.place_id),
    }) !== true
  ) {
    let validaciones = check({
      place_id: Number(req.params.place_id),
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
    var place_id = req.params.place_id;

    //   if (req.roleName !== "ADMIN") {
    //     response = {
    //       message: "You are not prepare for be admin!",
    //       status: 409,
    //     };
    //     res.status(response.status);
    //     return res.json(response);
    //   }
    var query =
      "SELECT *FROM products WHERE products_deleted = false AND place_id = ? ORDER BY products_id DESC;";

    connection.query(query, [place_id], (error, result, fields) => {
      if (error) {
        response = {
          message: "Internal Server Error!",
          status: 500,
        };
        res.status(response.status);
        return res.json(response);
      } else {
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