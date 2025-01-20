const User = require("../../models/user.model");
const APIError = require("../../utils/apiError");
const catchAsync = require("../../utils/catchAsync");
const Email = require("../../utils/sendMail");
const { StatusCodes } = require("http-status-codes");

const { fileUpload } = require("../profile/fileUpload");
const CompanyModel = require("../../models/company.model");

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


exports.registerEmployee = catchAsync(async (req, res, next) => {
  const parsedBody = req.body;
  const { email } = parsedBody;

  // generate a temporary password
  const password = Math.random()
    .toString(36)
    .slice(-8);
  parsedBody.password = password;
  parsedBody.passwordConfirm = password;

  console.log(parsedBody);

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

  // activate the user as admin created it
  newUser.isVerified = true;


  await newUser.save();

  // send the email to the user
    await new Email(newUser, "http://localhost:4000").sendEmployeeRegistration(password);
    res.status(StatusCodes.CREATED).json({
      status: "success",
    });

  });


  exports.registerUserAccount = catchAsync(async (req, res, next) => {
    const parsedBody = req.body;
    const { email, company } = parsedBody;

    // generate a temporary password
    const password = Math.random()
      .toString(36)
      .slice(-8);
    parsedBody.password = password;
    parsedBody.passwordConfirm = password;


    const user = await User.findOne({
      email,
    });


    if (user) {
      return next(
        new APIError(`Email already registered`, StatusCodes.BAD_REQUEST)
      );
    }


    // check the company
    const companyModel = await CompanyModel.findOne({_id: company});
    if(!companyModel) return next(new APIError('Company does not exist', StatusCodes.BAD_REQUEST));

    let newUser = await new User(parsedBody);


    if (!newUser) {
      return next(
        new APIError(
          `User cannot be created at the moment`,
          StatusCodes.BAD_REQUEST
        )
      );
    }


    // activate the user as admin created it
    newUser.isVerified = true;

    await newUser.save();





    // send the email to the user
    await new Email(newUser, "http://localhost:4000").sendUserRegistration(password, {companyName : companyModel.name});
    res.status(StatusCodes.CREATED).json({
      status: "success",
    });

  });
