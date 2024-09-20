"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();
const fs = require("fs");

module.exports = function (req, res) {
  var response = {};
  const schema = {
    place_id: {
      type: "number",
      optional: false,
    },
    place_name: {
      type: "string",
      min: 1,
      max: 200,
      optional: false,
    },
    place_phone: {
      type: "string",
      min: 1,
      max: 200,
      optional: false,
    },
    place_address: {
      type: "string",
      min: 1,
      max: 1000,
      optional: false,
    },
    place_coords: {
      type: "string",
      min: 0,
      max: 1000,
      optional: true,
    },
    place_photo: {
      type: "string",
      optional: true,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      place_id: Number(req.body.place_id),
      place_name: req.body.place_name,
      place_phone: req.body.place_phone,
      place_address: req.body.place_address,
      place_coords: req.body.place_coords,
      place_photo: req.body.place_photo,
    }) !== true
  ) {
    let validaciones = check({
      place_id: Number(req.body.place_id),
      place_name: req.body.place_name,
      place_phone: req.body.place_phone,
      place_address: req.body.place_address,
      place_coords: req.body.place_coords,
      place_photo: req.body.place_photo,
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
    var place_id = req.body.place_id;
    var place_name = req.body.place_name;
    var place_phone = req.body.place_phone;
    var place_address = req.body.place_address;
    var place_coords = req.body.place_coords;
    var place_photo = req.body.place_photo;
    var url = null;

    if (req.roleName !== "ADMIN") {
      response = {
        message: "You are not prepare for be admin!",
        status: 409,
      };
      res.status(response.status);
      return res.json(response);
    }
    if (!place_photo) {
      updatePlace();
    } else {
      var base64Image = place_photo.split(";base64,").pop();
      var date = Date.now();
      var url_register = "uploads/images/" + date + ".png";
      fs.writeFile(url_register, base64Image, { encoding: "base64" }, function (
        err,
        data
      ) {
        url = "images/" + date + ".png";
        updatePlace();
      });
    }
    function updatePlace() {
      var query =
        "UPDATE place SET place_name = ?, place_phone = ?, place_address = ?, place_coords = ?, place_photo = ? WHERE place_id = ?;";

      var query2 = "SELECT *FROM place WHERE place_id = ?";

      connection.query(query2, [place_id], (error2, result2, fields2) => {
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
                place_name,
                place_phone,
                place_address,
                place_coords,
                url,
                place_id,
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
                    message: "Place updated!",
                    status: 200,
                  };
                  res.status(response.status);
                  return res.json(response);
                }
              }
            );
          } else {
            response = {
              message: "Place doesn't exists!",
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
