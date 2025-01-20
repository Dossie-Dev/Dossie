const express = require("express");
const { protect, restrictTo } = require("../controller/auth");
const { registerEmployee } = require("../controller/auth/signup");

const router = express.Router();


router.post("/employee", protect, restrictTo("admin"), registerEmployee);


module.exports = router;