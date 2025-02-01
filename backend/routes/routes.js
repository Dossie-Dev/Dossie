const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const adminRouter = require("./adminRoutes");
const companyRouter = require("./companyRoutes");
const scanRouter = require("./scanDocument");

router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/company", companyRouter);
router.use("/document", scanRouter);


module.exports = router;
