"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();
//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");

// Read HTML Template
var html = fs.readFileSync("templates/template.html", "utf8");

module.exports = function (req, res) {
  var response = {};
  const schema = {
    arr: {
      type: "array",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      arr: req.body.arr,
    }) !== true
  ) {
    let validaciones = check({
      arr: req.body.arr,
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
    var arr = req.body.arr;
    var total_price = 0;

    arr.map((value, i) => {
      total_price = total_price + value.products_price;
    });

    var query =
      "INSERT INTO bill(users_id, bill_users_received, bill_total_price, bill_created_at, bill_status) VALUES (?,?,?,?,?)";
    var query2 = "SELECT now()";

    var driver =
      "SELECT users_id FROM users INNER JOIN role ON users.role_id = role.role_id WHERE role_name = 'DRIVER' and users_status = true and users_accepted = true";
    var query3 = "SELECT * FROM bill ORDER BY bill_id DESC";
    var query4 =
      "INSERT INTO bill_detail(bill_id, place_id, products_id, bill_detail_count) VALUES(?,?,?,?)";
    var query5 = "DELETE FROM cart WHERE users_id = ?";

    var query6 =
      "SELECT *FROM bill_detail INNER JOIN products ON bill_detail.products_id = products.products_id INNER JOIN place ON bill_detail.place_id = place.place_id WHERE bill_id = ?";
    connection.query(driver, (edriver, rdriver, fdriver) => {
      if (edriver) {
        response = {
          message: "Internal Server Error1!",
          status: 500,
        };
        res.status(response.status);
        return res.json(response);
      } else {
        if (rdriver.length > 0) {
          connection.query(query2, function (error2, result2, field2) {
            if (error2) {
              response = {
                status: 500,
                message: "Internal Server Error2",
              };

              res.status(response.status);
              return res.json(response);
            } else {
              connection.query(
                query,
                [
                  req.userId,
                  rdriver[0].users_id,
                  total_price,
                  result2[0]["now()"],
                  false,
                ],
                (error, result, fields) => {
                  if (error) {
                    response = {
                      message: "Internal Server Error3!",
                      status: 500,
                    };
                    res.status(response.status);
                    return res.json(response);
                  } else {
                    connection.query(query3, (error3, result3, fields3) => {
                      if (error3) {
                        response = {
                          message: "Internal Server Error4!",
                          status: 500,
                        };
                        res.status(response.status);
                        return res.json(response);
                      } else {
                        arr.map((value, i) => {
                          connection.query(
                            query4,
                            [
                              result3[0].bill_id,
                              value.place_id,
                              value.products_id,
                              1,
                            ],
                            (error4, result4, fields4) => {
                              if (arr.length - 1 == i) {
                                connection.query(
                                  query5,
                                  [req.userId],
                                  (error5, result5, fields5) => {
                                    if (error5) {
                                      response = {
                                        message: "Internal Server Error5!",
                                        status: 500,
                                      };
                                      res.status(response.status);
                                      return res.json(response);
                                    } else {
                                      //aca
                                      connection.query(
                                        query6,
                                        [result3[0].bill_id],
                                        (error6, result6, fields6) => {
                                          if (error6) {
                                            response = {
                                              message:
                                                "Internal Server Error5!",
                                              status: 500,
                                            };
                                            res.status(response.status);
                                            return res.json(response);
                                          } else {
                                            var options = {
                                              format: "A3",
                                              orientation: "portrait",
                                              border: "10mm",
                                            };
                                            var detail = result6;
                                            var document = {
                                              html: html,
                                              data: {
                                                bill_id: result3[0].bill_id,
                                                bill_total_price: result3[0].bill_total_price,
                                                detail: detail,
                                              },
                                             
                                              path:
                                                "./uploads/images/" +
                                                "bill_" +
                                                result3[0].bill_id +
                                                ".pdf",
                                            };

                                            pdf
                                              .create(document, options)
                                              .then((responsePDF) => {
                                                response = {
                                                  message:
                                                    "Payment created! The driver will contact you soon!",
                                                  status: 200,
                                                };
                                                res.status(response.status);
                                                return res.json(response);
                                              })
                                              .catch((error) => {
                                                console.error(error);
                                              });
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        });
                      }
                    });
                  }
                }
              );
            }
          });
        } else {
          response = {
            message: "No drivers available, wait later!",
            status: 503,
          };
          res.status(response.status);
          return res.json(response);
        }
      }
    });
  }
};
