const express = require("express");
const { protect, restrictTo } = require("../controller/auth");
const { registerEmployee, registerUserAccount } = require("../controller/admin/signup");
const { deactivateAccount } = require("../controller/admin/deactivateAccount");
const { activateUserAccount } = require("../controller/admin/activateUserAccount");

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post("/employee", registerEmployee);
router.post("/useraccount", registerUserAccount);
router.post("/deactivateaccount/:id", deactivateAccount);
router.post("/activateaccount/:id", activateUserAccount)


module.exports = router;