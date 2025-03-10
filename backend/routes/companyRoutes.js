const express = require("express");
const { protect, restrictTo } = require("../controller/auth");
const { getAllCompanies, createCompany, getOneCompany, updateOneCompany, deleteOneCompany } = require("../controller/companyController");



const router = express.Router();

router.use(protect);

router
    .route("/")
    .get(restrictTo("admin", "user","employee"), getAllCompanies)
    .post(restrictTo("admin"), createCompany);


router.route("/:id")
    .get(restrictTo("admin", "user", "employee"), getOneCompany)
    .patch(restrictTo("admin", "employee"), updateOneCompany)
    .delete(restrictTo("admin", "employee"), deleteOneCompany);

module.exports = router;
