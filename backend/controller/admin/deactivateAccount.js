const User = require("../../models/user.model");
const catchAsync = require("../../utils/catchAsync");
const APIError = require("../../utils/apiError");
const { StatusCodes } = require("http-status-codes");

exports.deactivateAccount = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return next(
        new APIError(`No document found with id = ${req.params.id}`, 404)
      );
    }

    user.active = false;
    await user.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      data: null,
    });

});