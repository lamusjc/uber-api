"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = function (req, res, next) {
  var response = {};
  const token = req.headers.authorization;
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
        req.userId = decoded.users_id;
        req.roleId = decoded.role_id;
        req.roleName = decoded.role_name;
        next();
      }
    });
  }
};
