const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { type } = require("os");

const user = new mongoose.Schema(
  {
    firstName: {
      type: String,
      validate: [
        validator.isAlpha,
        "Only characters are allowed as First Name,{VALUE}",
      ],
      default: null,
      required: [true, "Please provide a First Name"],
    },
    lastName: {
      type: String,
      validate: [validator.isAlpha, "Only characters are allowed as Last Name"],
      default: null,
      required: [true, "Please provide a Last Name"],
    },
    email: {
      type: String,
      default: null,
      unique: true,
      required: [true, "Please provide an Email"],
      validate: [validator.isEmail, "Invalid Email format"],
    },
    phoneNumber: {
      type: Number,
      default: null,
    },
    password: {
      type: String,
      default: null,
      // validate: [
      //   validator.isAlphanumeric,
      //   "Only letters and numbers are allowed as password",
      // ],
      minlength: 8,
      maxlength: 100,
      required: [true, "Please provide a Password"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: [
        validator.isAlphanumeric,
        "Only letters and numbers are allowed as password",
      ],
      default: null,
      required: [true, "Please confirm your password "],
      select: false,
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Passwords that you entered do not match",
      },
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      required: false,
      default: "user",
      enum: {
        values:["user", "employee", "admin"],
        message: "role must be within the specified values",
      },
    },
    passwordResetToken: {
      type: String,
      default: undefined,
    },
    passwordResetExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    activationToken: {
      type: String,
      default: undefined,
    },
    isSystemAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

user.pre("save", function (next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      user.passwordConfirm = hash;
      next();
    });
  });
});

user.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

user.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passwordChangedAt, JWTTimestamp);

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

user.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({
  //   resetToken
  // }, this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

user.methods.createActivationToken = function () {
  const activationToken = crypto.randomBytes(32).toString("hex");

  this.activationToken = crypto
    .createHash("sha256")
    .update(activationToken)
    .digest("hex");

  // console.log({
  //   resetToken
  // }, this.passwordResetToken)

  // this.activationTokenExpires = Date.now() + 10 * 60 * 1000;

  return activationToken;
};

// user.methods.addAsAdmin = function (id) {
//   this.adminOf.push(id);
//   this.save();
//   return this;
// };

user.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

const User = new mongoose.model("User", user);

module.exports = User;
