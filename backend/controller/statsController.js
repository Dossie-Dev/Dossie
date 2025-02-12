const { isExpressionWithTypeArguments } = require("typescript");
const CompanyModel = require("../models/company.model");
const { ResearchPaper } = require("../models/research.paper.model");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const moment = require('moment');
const ActivityLog = require("../models/activity.log.model");
const { StatusCodes } = require("http-status-codes");



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
    // Get the current month and one year ago
    const now = moment().endOf('month');
    const oneYearAgo = moment().subtract(1, 'year').startOf('month');
    
    let monthsData = [];

    // Initialize all months with zero count
    for (let i = 0; i < 12; i++) {
        monthsData.push({
            month: oneYearAgo.clone().add(i, 'months').format('MMMM'), // Display full month name
            value: 0
        });
    }

    // Fetch papers created within the last year
    const papers = await ResearchPaper.find({
        createdAt: { $gte: oneYearAgo.toDate(), $lte: now.toDate() }
    });

    // Count papers per month
    papers.forEach(paper => {
        const paperMonth = moment(paper.createdAt).format('MMMM'); // Get month name
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



exports.getLoginActivityMonthly = catchAsync(async (req, res, next) => {
    // Get the start of the current month last year
    const oneYearAgo = moment().subtract(1, "year").startOf("month");
    const now = moment().endOf("month");

    // Aggregate login activity count per month for the last year
    const loginData = await ActivityLog.aggregate([
        {
            $match: {
                date: { $gte: oneYearAgo.toDate(), $lte: now.toDate() },
                activity: "Login"
            }
        },
        {
            $group: {
                _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                loginCount: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        }
    ]);

    // Initialize result with all months set to zero
    const result = {};
    moment.months().forEach(month => {
        result[month] = 0;
    });

    // Populate result with actual data
    loginData.forEach(item => {
        const monthName = moment().month(item._id.month - 1).format("MMMM");
        result[monthName] = item.loginCount;
    });

    res.status(StatusCodes.OK).json({
        status: "success",
        data: result
    });
});
