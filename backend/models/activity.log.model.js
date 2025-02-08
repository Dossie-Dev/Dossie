const mongoose = require("mongoose");

// create activity log schema
const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    activity: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// create activity log model
const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
