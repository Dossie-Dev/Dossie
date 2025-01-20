const express = require("express");
const { protect, restrictTo } = require("../controller/auth");
const { getAllCompanies, createCompany, getOneCompany, updateOneCompany, deleteOneCompany } = require("../controller/companyController");



const router = express.Router();

router.use(protect);

router
    .route("/")
    .get(restrictTo("admin", "user"), getAllCompanies)
    .post(restrictTo("admin"), createCompany);


router.route("/:id")
    .get(restrictTo("admin", "user"), getOneCompany)
    .patch(restrictTo("admin"), updateOneCompany)
    .delete(restrictTo("admin"), deleteOneCompany);

module.exports = router;
