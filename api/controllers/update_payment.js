"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();
const fs = require("fs");

module.exports = function (req, res) {
  var response = {};
  const schema = {
    bill_id: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      bill_id: Number(req.body.bill_id),
    }) !== true
  ) {
    let validaciones = check({
      bill_id: Number(req.body.bill_id),
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
    var bill_id = req.body.bill_id;

    if (req.roleName !== "DRIVER") {
      response = {
        message: "You are not prepare for be driver!",
        status: 409,
      };
      res.status(response.status);
      return res.json(response);
    }

    var query = "UPDATE bill SET bill_status = true WHERE bill_id = ?;";

    connection.query(query, [bill_id], (error, result, fields) => {
      if (error) {
        response = {
          message: "Internal Server Error!",
          status: 500,
        };
        res.status(response.status);
        return res.json(response);
      } else {
        response = {
          message: "Order delivered!",
          status: 200,
        };
        res.status(response.status);
        return res.json(response);
      }
    });
  }
};
