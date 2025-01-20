const express = require("express");
const { protect, restrictTo } = require("../controller/auth");
const { registerEmployee, registerUserAccount } = require("../controller/auth/signup");

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post("/employee", registerEmployee);
router.post("/useraccount", registerUserAccount)


module.exports = router;