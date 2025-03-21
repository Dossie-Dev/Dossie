// activity log middleware
const { StatusCodes } = require("http-status-codes");
const catchAsync = require("./catchAsync");
const ActivityLog = require("../models/activity.log.model");

const activityLogMiddleware = (activity) => catchAsync( async (req, res, next) => {
    const user = req.user.id;
    const activityLog = await ActivityLog.create({ user, activity });

    next()
});



module.exports = activityLogMiddleware;