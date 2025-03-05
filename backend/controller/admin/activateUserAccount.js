const catchAsync = require("../../utils/catchAsync");
const User = require("../../models/user.model");
const APIError = require("../../utils/apiError");

exports.activateUserAccount = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return next(
        new APIError(`No document found with id = ${req.params.id}`, 404)
      );
    }


    user.active = true;
    await user.save();


    res.status(200).json({
      status: "success",
      data: null,
    });

});