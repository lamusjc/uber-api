"use strict";

module.exports = function (req, res) {
  var response = {};

  // if (req.roleName !== "ADMIN") {
  //   response = {
  //     message: "You are not prepare for be admin!",
  //     status: 409,
  //   };
  //   res.status(response.status);
  //   return res.json(response);
  // }
  var query =
    "SELECT * FROM cart " +
    "LEFT JOIN products ON cart.products_id = products.products_id " +
    "LEFT JOIN place ON products.place_id = place.place_id " +
    "WHERE users_id = ?";

  connection.query(query, [req.userId], (error, result, fields) => {
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