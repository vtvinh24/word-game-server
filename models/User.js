const mongoose = require("mongoose");
const baseSchema = require("./Base");
const { ROLE, USER_STATUS } = require("../enum/Fields");
const { LOCALE } = require("../enum/Locale");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    default: null,
  },
  tag: {
    type: String,
    required: true,
    default: "0000",
  },
  auth: {
    hash: {
      type: String,
      required: true,
      default: null,
    },
    salt: {
      type: String,
      required: true,
      default: undefined,
    },
    otpSecret: {
      type: String,
      default: null,
    },
    enable2FA: {
      type: Boolean,
      required: true,
      default: false,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  email: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ROLE,
    default: ROLE[0],
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  dob: {
    type: Date,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: USER_STATUS,
    default: USER_STATUS[0],
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  subscribed: {
    type: Boolean,
    default: false,
  },
  visibility: {
    type: Boolean,
    // true if public
    default: false,
  },
});

userSchema.pre("save", function (next) {
  if (!this.email && !this.phone && !this.username) {
    return next(new Error("Either email, phone or username is required"));
  }
  next();
});

// lowercase email before saving
userSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

userSchema.virtual("fullName").get(function (locale = LOCALE.ENGLISH) {
  switch (locale) {
    case LOCALE.VIETNAM:
      return `${this.lastName} ${this.firstName}`;
    default:
      return `${this.firstName} ${this.lastName}`;
  }
});

userSchema.virtual("enable2FA").get(function () {
  return this.auth.enable2FA;
});

userSchema.virtual("verified").get(function () {
  return this.auth.verified;
});

userSchema.virtual("completed").get(function () {
  if (!this.firstName || !this.lastName || !this.dob || !this.address || !this.country || !this.idType || !this.citizenId) {
    return false;
  }
  return true;
});

userSchema.add(baseSchema);

const User = mongoose.model("User", userSchema);
module.exports = User;
