const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const adminRouter = require("./adminRoutes");
const companyRouter = require("./companyRoutes");

router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/company", companyRouter);


module.exports = router;
