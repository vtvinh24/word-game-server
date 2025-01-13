const mongoose = require("mongoose");
const baseSchema = require("./Base");
const { ROLE, USER_STATUS, LANGUAGE } = require("#enum/Fields.js");

const userSchema = new mongoose.Schema({
  identifier: {
    username: {
      type: String,
      required: true,
      unique: false,
      default: null,
    },
    tag: {
      type: String,
      required: true,
      default: "",
    },
  },
  auth: {
    role: {
      type: String,
      enum: ROLE,
      default: ROLE[0],
    },
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
    avatar: {
      type: String,
      default: null,
    },
  },
  settings: {
    language: {
      type: String,
      enum: LANGUAGE,
      default: LANGUAGE[0],
    },
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

userSchema.virtual("fullName").get(function (reversed = false) {
  if (reversed) {
    return `${this.profile.lastName} ${this.profile.firstName}`;
  }
  return `${this.profile.firstName} ${this.profile.lastName}`;
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
