const User = require("../../models/user.model");
const APIError = require("../../utils/apiError");
const catchAsync = require("../../utils/catchAsync");
const Email = require("../../utils/sendMail");
const { StatusCodes } = require("http-status-codes");

const { fileUpload } = require("./../profile/fileUpload");

exports.signUp = catchAsync(async (req, res, next) => {
  const parsedBody = req.body;
  const { email } = parsedBody;

  const user = await User.findOne({
    email,
  });

  if (user) {
    return next(
      new APIError(`Email already registered`, StatusCodes.BAD_REQUEST)
    );
  }

  let newUser = await new User(parsedBody);

  if (!newUser) {
    return next(
      new APIError(
        `User cannot be created at the moment`,
        StatusCodes.BAD_REQUEST
      )
    );
  }

  //activationToken
  const activationToken = newUser.createActivationToken();

  await newUser.save();

  const activationURL = `http://${"localhost:4000"}/activate?token=${activationToken}&email=${email}`;

  try {
    await new Email(newUser, activationURL).sendPasswordReset();
    console.log(activationURL);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: activationToken,
    });
  } catch (err) {
    newUser.activationToken = undefined;
    newUser.activationTokenExpires = undefined;
    await newUser.save({
      validateBeforeSave: false,
    });

    return next(
      new APIError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
