const mongoose = require("mongoose");
const baseSchema = require("./Base");
const { ROLE, USER_STATUS } = require("#enum/Fields.js");
const { LOCALE } = require("#enum/Locale.js");

const userSchema = new mongoose.Schema({
  identifier: {
    username: {
      type: String,
      required: true,
      unique: true,
      default: null,
    },
    tag: {
      type: String,
      required: true,
      default: "",
    },
    role: {
      type: String,
      enum: ROLE,
      default: ROLE[0],
    },
  },
  auth: {
    email: {
      type: String,
      default: null,
    },
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
    twoFactor: {
      secret: {
        type: String,
        default: null,
      },
      enabled: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    banned: {
      type: Date,
      default: null,
    },
  },
  profile: {
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
    language: {
      type: String,
      enum: LOCALE,
      default: LOCALE.UNITED_STATES,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  settings: {
    status: {
      type: String,
      enum: USER_STATUS,
      default: USER_STATUS[0],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
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
  return this.auth.twoFactor.enabled;
});

userSchema.virtual("verified").get(function () {
  return this.auth.verified;
});

userSchema.add(baseSchema);

const User = mongoose.model("User", userSchema);
module.exports = User;
