"use strict";
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

module.exports = function (req, res) {
  var response = {};
  const token = req.headers.authorization;
  const query = "SELECT *FROM users INNER JOIN role ON users.role_id = role.role_id WHERE users_id = ?";

  if (!token) {
    response = {
      message: "No token provided",
      status: 403,
    };
    res.status(response.status);
    return res.json(response);
  }

  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        response = {
          message: "Error with auth token!",
          status: 403,
        };
        res.status(response.status);
        return res.json(response);
      } else if (!req.session.users_id) {
        response = {
          message: "Session error!",
          status: 403,
        };
        res.status(response.status);
        return res.json(response);
      } else {
        connection.query(query, [decoded.users_id], function (
          errq,
          result,
          fields
        ) {
          if (errq) {
            response = {
              message: "Internal Server Error!",
              status: 500,
            };
            res.status(response.status);
            return res.json(response);
          } else {
            response = {
              data: {
                users_id: result[0].users_id,
                username: result[0].users_username,
                role_name: result[0].role_name,
                role_id: result[0].role_id,
              },
              message: "Success!",
              status: 200,
            };
            res.status(response.status);
            return res.json(response);
          }
        });
      }
    });
  }
};
