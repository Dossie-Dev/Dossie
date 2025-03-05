const express = require("express");
const { protect, restrictTo } = require("../controller/auth");
const { registerEmployee, registerUserAccount } = require("../controller/admin/signup");
const { deactivateAccount } = require("../controller/admin/deactivateAccount");
const { activateUserAccount } = require("../controller/admin/activateUserAccount");
const activityLogMiddleware = require("../utils/activityLogMiddleware");

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post("/employee", activityLogMiddleware("Register Employee"),registerEmployee);
router.post("/useraccount",activityLogMiddleware("Register User Account"), registerUserAccount);
router.post("/deactivateaccount/:id", activityLogMiddleware("Deactivate Account"),deactivateAccount);
router.post("/activateaccount/:id", activityLogMiddleware("Activate Account"),activateUserAccount)


module.exports = router;