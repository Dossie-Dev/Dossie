const ActivityLog = require("../models/activity.log.model");
const factory = require("../controller/handlerFactory");

exports.getAllActivityLogs = factory.getAll(ActivityLog);
exports.getActivityLog = factory.getOne(ActivityLog);