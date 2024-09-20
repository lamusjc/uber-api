"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();
const moment = require("moment");

module.exports = function (req, res) {
  var response = {};

  const schema = {
    bill_id: {
      type: "number",
      optional: false,
    },
    buyer: {
      type: "number",
      optional: false,
    },
    driver: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      bill_id: Number(req.params.bill_id),
      buyer: Number(req.params.buyer),
      driver: Number(req.params.driver),
    }) !== true
  ) {
    let validaciones = check({
      bill_id: Number(req.params.bill_id),
      buyer: Number(req.params.buyer),
      driver: Number(req.params.driver),
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
    var bill_id = req.params.bill_id;
    var buyer = req.params.buyer;
    var driver = req.params.driver;

    //   if (req.roleName !== "ADMIN") {
    //     response = {
    //       message: "You are not prepare for be admin!",
    //       status: 409,
    //     };
    //     res.status(response.status);
    //     return res.json(response);
    //   }
    var query =
      "SELECT *FROM chat " +
      "LEFT JOIN users ON chat.users_id = users.users_id " +
      "WHERE (chat.users_id = ? OR chat.users_id = ?) AND (chat_users_id_received = ? or chat_users_id_received = ?) AND bill_id = ? " +
      "ORDER BY chat_created_at ASC;";

    connection.query(
      query,
      [buyer, driver, buyer, driver, bill_id],
      (error, result, fields) => {
        if (error) {
          response = {
            message: "Internal Server Error!",
            status: 500,
          };
          res.status(response.status);
          return res.json(response);
        } else {
          result.map((value, i) => {
            value.chat_created_at = moment(value.chat_created_at).format(
              "DD/MM/YYYY hh:mm a"
            );
            delete value.users_password;
          });
          response = {
            message: "Success!",
            status: 200,
            data: result,
          };
          res.status(response.status);
          return res.json(response);
        }
      }
    );
  }
};
