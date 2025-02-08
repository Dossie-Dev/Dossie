const { isExpressionWithTypeArguments } = require("typescript");
const CompanyModel = require("../models/company.model");
const { ResearchPaper } = require("../models/research.paper.model");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const moment = require('moment');



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



exports.getDocumentStats = catchAsync(async (req, res, next) => {
    // no of research papers that are uploaded per month for a year
    // {month : "the month", value: "count of the research papers"}
    // collect the data from the database
    // starting from one year ago
    // end at the current month

    // get the one year ago data
    // create a look and iterate over the data
        const now = moment().endOf('month');
        const oneYearAgo = moment().subtract(1, 'year').startOf('month');
        
        let monthsData = [];
        
        // Initialize all months with zero count
        for (let i = 0; i < 12; i++) {
            monthsData.push({
                month: oneYearAgo.clone().add(i, 'months').format('YYYY-MM'),
                value: 0
            });
        }

        // Fetch papers created within the last year
        const papers = await ResearchPaper.find({
            createdAt: { $gte: oneYearAgo.toDate(), $lte: now.toDate() }
        });

        // Count papers per month
        papers.forEach(paper => {
            const paperMonth = moment(paper.createdAt).format('YYYY-MM');
            const index = monthsData.findIndex(item => item.month === paperMonth);
            if (index !== -1) {
                monthsData[index].value++;
            }
        });


    res.status(200).json({
        status: "success",
        data: monthsData,
    });
});