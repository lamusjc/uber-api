"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports.respond = function (socket, io) {
  var response = {};
  console.log("crear chat", io);
  socket.on("send-message", function (message) {
    console.log("mensaje", message);
    io.emit("message", {
      msg: message.text,
      user: socket.username,
      createdAt: new Date(),
    });
    const schema = {
      bill_id: {
        type: "number",
        optional: false,
      },
      chat_users_id_received: {
        type: "number",
        optional: false,
      },
      chat_users_username_received: {
        type: "string",
        optional: false,
      },
      chat_users_fullname: {
        type: "string",
        optional: false,
      },
      chat_message: {
        type: "string",
        optional: false,
      },
    };

    const check = _validator.compile(schema);

    if (
      check({
        users_id: Number(message.users_id),
        bill_id: Number(message.bill_id),
        chat_users_id_received: Number(message.chat_users_id_received),
        chat_users_username_received: message.chat_users_username_received,
        chat_users_fullname: message.chat_users_fullname,
        chat_message: message.chat_message,
      }) !== true
    ) {
      let validaciones = check({
        users_id: Number(message.users_id),
        bill_id: Number(message.bill_id),
        chat_users_id_received: Number(message.chat_users_id_received),
        chat_users_username_received: message.chat_users_username_received,
        chat_users_fullname: message.chat_users_fullname,
        chat_message: message.chat_message,
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
      var users_id = message.users_id;
      var bill_id = message.bill_id;
      var chat_users_id_received = message.chat_users_id_received;
      var chat_users_username_received = message.chat_users_username_received;
      var chat_users_fullname = message.chat_users_fullname;
      var chat_message = message.chat_message;

      var query =
        "INSERT INTO chat(users_id, bill_id, chat_users_id_received, chat_users_username_received, chat_users_fullname, chat_message, chat_created_at) VALUES (?,?,?,?,?,?,?)";
      var query2 = "SELECT now()";
      connection.query(query2, (error2, result2, fields2) => {
        if (error2) {
          response = {
            message: "Internal Server Error!",
            status: 500,
          };
          console.log(response);
        } else {
          connection.query(
            query,
            [
              users_id,
              bill_id,
              chat_users_id_received,
              chat_users_username_received,
              chat_users_fullname,
              chat_message,
              result2[0]["now()"],
            ],
            (error, result, fields) => {
              if (error) {
                response = {
                  message: "Internal Server Error!",
                  status: 500,
                };
                console.log(response);
              } else {
                response = {
                  message: "Chat created!",
                  status: 200,
                };
                console.log(response);
              }
            }
          );
        }
      });
    }
  });
};
