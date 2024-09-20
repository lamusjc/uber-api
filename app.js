//Importamos las librerias
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var cors = require("cors");
const path = require("path");
var PORT = process.env.PORT || 3000;
//Configuramos el express
var app = express();
var http = require("http");
var server = http.Server(app);
const io = require("socket.io").listen(server);
const create_chat = require("./api/controllers/create_chat");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1800000,
    },
  })
);

app.use("/", require("./api/controllers"));
app.use(express.static(path.join(__dirname, "uploads")));

// Conexion con la base de datos
// connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "",
//     database: "movildb",
// });

function handleDisconnect() {
  connection = mysql.createConnection(
    "mysql://bf7a1ba220d490:d76cdc43@us-cdbr-east-02.cleardb.com/heroku_97682be507ed0a5?reconnect=true"
  );

  // connection = mysql.createConnection({
  //   host: "localhost",
  //   port: 3306,
  //   user: "root",
  //   password: "",
  //   database: "uberdb",
  // });

  connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }

    console.log(
      "\nConectado a la base de datos con éxito con id: " + connection.threadId
    );
  });

  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// io.on("connection", (socket) => {
//   console.log("user connected");

//   socket.on("disconnect", function () {
//     io.emit("users-changed", { user: socket.username, event: "left" });
//   });

//   socket.on("set-name", (name) => {
//     console.log("setname");
//     socket.username = name;
//     io.emit("users-changed", { user: name, event: "joined" });
//   });

//   socket.on("send-message", (message) => {
//     io.emit("message", {
//       msg: message.text,
//       user: socket.username,
//       createdAt: new Date(),
//     });
//   });
// });
io.sockets.on("connection", function (socket) {
  console.log("conectado");
  create_chat.respond(socket, io);
});
//Iniciar el servidor
server.listen(PORT, function () {
  console.log("\nServidor local iniciado con éxito en el puerto: " + PORT);
});
