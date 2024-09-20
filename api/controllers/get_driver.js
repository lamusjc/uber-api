"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};

  if (req.roleName !== "ADMIN") {
    response = {
      message: "You are not prepare for be admin!",
      status: 409,
    };
    res.status(response.status);
    return res.json(response);
  }
  var query =
    "SELECT users.role_id, role_name, users.users_id, users_firstname, users_lastname, users_username, users_address, users_coords, users_photo, users_vehicle_brand, users_vehicle_year, users_vehicle_license, users_vehicle_color, users_accepted FROM users INNER JOIN role ON users.role_id = role.role_id WHERE role.role_name = 'DRIVER' ORDER BY users_id DESC;";

  connection.query(query, (error, result, fields) => {
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
};
