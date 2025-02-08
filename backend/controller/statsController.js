const CompanyModel = require("../models/company.model");
const { ResearchPaper } = require("../models/research.paper.model");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");



exports.getStats = catchAsync(async (req, res, next) => {
    // get the number of users
    const numUsers = await User.countDocuments();
    // get the number of companies
    const numCompanies = await CompanyModel.countDocuments();
    // get the number of researchPapers
    const numResearchPapers = await ResearchPaper.countDocuments();

    // get then number of employees
    const numEmployees = await User.aggregate([
        {
            $match: { role: "employee" },
        },
        {
            $group: {
                _id: null,
                numEmployees: { $sum: 1 },
            },
        },
    ]);


    // no_of_users, no_of_companies, no_of_researchPapers, no_of_employees
    res.status(200).json({
        status: "success",
        data: {
            "no_of_users": numUsers,
            "no_of_companies": numCompanies,
            "no_of_researchPapers": numResearchPapers,
            "no_of_employees": numEmployees[0].numEmployees,
        },
    });
});