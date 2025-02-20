const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const catchAsync = require("./catchAsync");
const APIError = require("./apiError");


exports.addCompanyId = catchAsync(async (req, res, next) => {
    // get the current user 
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new APIError("You do not have permission to perform this action", StatusCodes.FORBIDDEN));
    }

    if (user.role == "admin") {
        return next();
    }

    req.body.companyId = user.company;
    next();
});