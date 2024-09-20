"use strict";

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
    "SELECT *FROM products WHERE products_deleted = false ORDER BY products_id DESC;";

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