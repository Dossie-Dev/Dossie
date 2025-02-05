const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const adminRouter = require("./adminRoutes");
const companyRouter = require("./companyRoutes");
const researchRouter = require("./researchRoutes");
const scanRouter = require("./scanDocument");
const { protect } = require("../controller/auth");

router.use("/users",  userRouter);
router.use("/admin", adminRouter);
router.use("/company",protect, companyRouter);
router.use("/document",protect, scanRouter);
router.use("/research",protect, researchRouter);


module.exports = router;
