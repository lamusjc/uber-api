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
    "SELECT * FROM bill_detail " +
    "inner join bill on bill_detail.bill_id = bill.bill_id " +
    "inner join place on bill_detail.place_id = place.place_id " +
    "inner join products on bill_detail.products_id = products.products_id " +
    "where bill.users_id = ? ORDER BY bill.bill_id DESC;";

  connection.query(query, [req.userId], (error, result, fields) => {
    if (error) {
      response = {
        message: "Internal Server Error!",
        status: 500,
      };
      res.status(response.status);
      return res.json(response);
    } else {
      // Esta funcion permite eliminar elementos duplicados como el id del bill
      var auxJson = {};
      var unicBill = [];
      var arr = [];
      result.map((value, i) => {
        arr.push({
          bill_id: value.bill_id,
          users_id: value.users_id,
          bill_users_received: value.bill_users_received,
          bill_total_price: value.bill_total_price,
          bill_created_at: value.bill_created_at,
          bill_status: value.bill_status,
        });
      });
      unicBill = arr.filter(function (e) {
        return auxJson[e.bill_id] ? false : (auxJson[e.bill_id] = true);
      });
      // Esta funcion permite eliminar elementos duplicados como el id del bill
      unicBill.map((value, i) => {
        unicBill[i].detail = [];
        unicBill[i].visible = false;
        result.map((value2, j) => {
          if (unicBill[i].bill_id == value2.bill_id) {
            unicBill[i].detail.push({
              products_id: value2.products_id,
              place_id: value2.place_id,
              products_price: value2.products_price,
              products_photo: value2.products_photo,
              products_name: value2.products_name,
              place_name: value2.place_name,
              place_phone: value2.place_phone,
              place_address: value2.place_address,
              place_coords: value2.place_coords,
              place_photo: value2.place_photo,
              bill_detail_count: value2.bill_detail_count,
              bill_id: value2.bill_id,
              bill_detail_id: value2.bill_detail_id,
            });
          }
        });
      });

      response = {
        message: "Success!",
        status: 200,
        data: unicBill,
      };
      res.status(response.status);
      return res.json(response);
    }
  });
};
