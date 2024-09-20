"use strict";

const express = require("express");
var router = express.Router();
const verifyToken = require("../../middlewares/verify_token");

//Endpoints de usuario
router.post("/register", require("./register.js"));
router.post("/login", require("./login.js"));
router.get("/info", require("./info.js"));
router.get("/logout", require("./logout.js"));

//Endpoints de place
router.post("/place", verifyToken, require("./create_place.js"));
router.get("/place", verifyToken, require("./get_place.js"));
router.put("/place", verifyToken, require("./update_place.js"));
router.delete("/place/:place_id", verifyToken, require("./delete_place.js"));

//Endpoints de products
router.post("/products", verifyToken, require("./create_products.js"));
router.get("/products", verifyToken, require("./get_products.js"));
router.get(
  "/products/:place_id",
  verifyToken,
  require("./get_products_place.js")
);
router.put("/products", verifyToken, require("./update_products.js"));
router.delete(
  "/products/:products_id",
  verifyToken,
  require("./delete_products.js")
);

// Endpoints de cart
router.post("/cart", verifyToken, require("./create_cart.js"));
router.get("/cart", verifyToken, require("./get_cart.js"));
router.delete("/cart/:cart_id", verifyToken, require("./delete_cart.js"));

// Endpoint de payment
router.get("/payment", verifyToken, require("./get_payment.js"));
router.post("/payment", verifyToken, require("./add_payment.js"));
router.put("/payment", verifyToken, require("./update_payment.js"));

// Endpoint de driver
router.get("/driver", verifyToken, require("./get_driver.js"));
router.put("/driver", verifyToken, require("./update_driver.js"));

// Endpoint de user
router.get("/getuser/:users_id", verifyToken, require("./get_user_id.js"));

// Endpoint de orders
router.get("/pending_orders", verifyToken, require("./get_pending_orders.js"));

// Endpoint de chats
router.get("/chat/:bill_id/:buyer/:driver", verifyToken, require("./get_chat.js"));

module.exports = router;
