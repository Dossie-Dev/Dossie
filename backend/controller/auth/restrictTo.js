const { StatusCodes } = require("http-status-codes");
const APIError = require("../../utils/apiError");
const User = require("../../models/user.model");

// role -> ['ado', 'rv', 'vp', 'strategic', 'office', 'admin']
exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id });

    if (user.role in roles) return next();


    return next(
      new APIError(
        "You do not have permission to perform this action",
        StatusCodes.FORBIDDEN
      )
    );
  };
};
