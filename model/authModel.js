const mongoose = require("mongoose");
const { isEmail } = require("validator");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, default: "" },
    number: { type: String, default: "" },
    password: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email Address is Required"],
      validate: {
        validator: isEmail,
        message: "Please provide a valid email",
      },
      unique: true,
      dropDups: true,
    },
    dob: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    country: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    twithd: { type: String, default: "" },
    dob: { type: String, default: "" },
    tAmount: { type: Number, default: 0 },
    profilePics: { type: String, default: "" },
    tBonus: { type: String, default: 0 },
    postcode: { type: String, default: "" },
    tDeposit: { type: Number, default: 0 },
    tProfit: { type: Number, default: 0 },
    tBtc: { type: Number, default: 0 },
    tUsdt: { type: Number, default: 0 },
    tLtc: { type: Number, default: 0 },
    tEth: { type: Number, default: 0 },
    kycinfo: { type: String, default: "" },
    receipts: { type: Array, default: [] },
    staked: {type: Array, default: []},
    accountype: { type: String, default: "Basic" },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    // passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // // Delete passwordConfirm field
  // this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};


userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  // this.passwordResetExpires = Date.now() + 60 * 1000;

  return resetToken;
};


const User = mongoose.model("user", userSchema);

module.exports = User;
