"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};
  const schema = {
    products_id: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      products_id: Number(req.params.products_id),
    }) !== true
  ) {
    let validaciones = check({
      products_id: Number(req.params.products_id),
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
    var products_id = req.params.products_id;

    if (req.roleName !== "ADMIN") {
      response = {
        message: "You are not prepare for be admin!",
        status: 409,
      };
      res.status(response.status);
      return res.json(response);
    }
    var query =
      "UPDATE products SET products_deleted = true WHERE products_id = ?";

    var query2 = "SELECT *FROM products WHERE products_id = ?";

    connection.query(query2, [products_id], (error2, result2, fields2) => {
      if (error2) {
        response = {
          message: "Internal Server Error!",
          status: 500,
        };
        res.status(response.status);
        return res.json(response);
      } else {
        if (result2.length > 0) {
          connection.query(query, [products_id], (error, result, fields) => {
            if (error) {
              response = {
                message: "Internal Server Error!",
                status: 500,
              };
              res.status(response.status);
              return res.json(response);
            } else {
              response = {
                message: "Products deleted!",
                status: 200,
              };
              res.status(response.status);
              return res.json(response);
            }
          });
        } else {
          response = {
            message: "Products doesn't exists!",
            status: 500,
          };
          res.status(response.status);
          return res.json(response);
        }
      }
    });
  }
};
