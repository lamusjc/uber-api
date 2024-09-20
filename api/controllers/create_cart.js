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
      products_id: Number(req.body.products_id),
    }) !== true
  ) {
    let validaciones = check({
      products_id: Number(req.body.products_id),
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
    var products_id = req.body.products_id;

    //   if (req.roleName !== "ADMIN") {
    //     response = {
    //       message: "You are not prepare for be admin!",
    //       status: 409,
    //     };
    //     res.status(response.status);
    //     return res.json(response);
    //   }
    var query = "INSERT INTO cart(users_id, products_id) VALUES (?,?)";
    var query2 = "SELECT *FROM cart WHERE users_id = ? AND products_id = ?";
    connection.query(
      query2,
      [req.userId, products_id],
      (error2, result2, fields2) => {
        if (error2) {
          response = {
            message: "Internal Server Error!",
            status: 500,
          };
          res.status(response.status);
          return res.json(response);
        } else {
          if (result2.length > 0) {
            response = {
              message: "This product has already in your cart!",
              status: 409,
            };
            res.status(response.status);
            return res.json(response);
          } else {
            connection.query(
              query,
              [req.userId, products_id],
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
                    message: "Cart created!",
                    status: 200,
                  };
                  res.status(response.status);
                  return res.json(response);
                }
              }
            );
          }
        }
      }
    );
  }
};