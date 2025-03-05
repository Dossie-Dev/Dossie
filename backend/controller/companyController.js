const APIError = require("../utils/apiError");
const handleFactory = require("../controller/handlerFactory");
const CompanyModel = require("../models/company.model");

const createCompany = handleFactory.createOne(CompanyModel);
const getAllCompanies = handleFactory.getAll(CompanyModel);
const getOneCompany = handleFactory.getOne(CompanyModel);
const updateOneCompany = handleFactory.updateOne(CompanyModel);
const deleteOneCompany = handleFactory.deleteOne(CompanyModel);

module.exports = {
    createCompany,
    getAllCompanies,
    getOneCompany,
    updateOneCompany,
    deleteOneCompany,
};


