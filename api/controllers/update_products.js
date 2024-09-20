"use strict";
const Validator = require("fastest-validator");
const fs = require("fs");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};
  const schema = {
    products_id: {
      type: "number",
      optional: false,
    },
    place_id: {
      type: "number",
      optional: false,
    },
    products_name: {
      type: "string",
      min: 1,
      max: 200,
      optional: false,
    },
    products_price: {
      type: "number",
      optional: false,
    },
    products_photo: {
      type: "string",
      optional: true,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      products_id: Number(req.body.products_id),
      place_id: Number(req.body.place_id),
      products_name: req.body.products_name,
      products_price: parseFloat(req.body.products_price),
      products_photo: req.body.products_photo,
    }) !== true
  ) {
    let validaciones = check({
      products_id: Number(req.body.products_id),
      place_id: Number(req.body.place_id),
      products_name: req.body.products_name,
      products_price: parseFloat(req.body.products_price),
      products_photo: req.body.products_photo,
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
    var place_id = req.body.place_id;
    var products_name = req.body.products_name;
    var products_price = req.body.products_price;
    var products_photo = req.body.products_photo;
    var url = null;

    if (req.roleName !== "ADMIN") {
      response = {
        message: "You are not prepare for be admin!",
        status: 409,
      };
      res.status(response.status);
      return res.json(response);
    }

    if (!products_photo) {
      updateProducts();
    } else {
      var base64Image = products_photo.split(";base64,").pop();
      var date = Date.now();
      var url_register = "uploads/images/" + date + ".png";
      fs.writeFile(url_register, base64Image, { encoding: "base64" }, function (
        err,
        data
      ) {
        url = "images/" + date + ".png";
        updateProducts();
      });
    }

    function updateProducts() {
      var query =
        "UPDATE products SET place_id = ?, products_name = ?, products_price = ?, products_photo = ? WHERE products_id = ?";

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
            connection.query(
              query,
              [
                place_id,
                products_name,
                products_price,
                url,
                products_id,
              ],
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
                    message: "Products updated!",
                    status: 200,
                  };
                  res.status(response.status);
                  return res.json(response);
                }
              }
            );
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
  }
};
