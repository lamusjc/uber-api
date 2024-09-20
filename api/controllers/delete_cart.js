"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};

  const schema = {
    cart_id: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      cart_id: Number(req.params.cart_id),
    }) !== true
  ) {
    let validaciones = check({
      cart_id: Number(req.params.cart_id),
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
    var cart_id = req.params.cart_id;

    //   if (req.roleName !== "ADMIN") {
    //     response = {
    //       message: "You are not prepare for be admin!",
    //       status: 409,
    //     };
    //     res.status(response.status);
    //     return res.json(response);
    //   }
    var query = "DELETE from cart WHERE cart_id = ? AND users_id = ?";

    var query2 = "SELECT *FROM cart WHERE cart_id = ? AND users_id = ?";

    connection.query(
      query2,
      [cart_id, req.userId],
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
            connection.query(
              query,
              [cart_id, req.userId],
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
                    message: "Cart deleted!",
                    status: 200,
                  };
                  res.status(response.status);
                  return res.json(response);
                }
              }
            );
          } else {
            response = {
              message: "Cart doesn't exists!",
              status: 500,
            };
            res.status(response.status);
            return res.json(response);
          }
        }
      }
    );
  }
};
