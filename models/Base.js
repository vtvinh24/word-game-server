const mongoose = require("mongoose");

const baseSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

baseSchema.virtual("isDeleted").get(function () {
  return this.deletedAt !== null;
});

baseSchema.methods.softDelete = function (deletedBy) {
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

baseSchema.methods.restore = function () {
  this.deletedAt = null;
  this.deletedBy = null;
  return this.save();
};

function excludeDeleted(next) {
  this.where({ deletedAt: null });
  next();
}

// baseSchema.pre("find", excludeDeleted);
// baseSchema.pre("findOne", excludeDeleted);
// baseSchema.pre("countDocuments", excludeDeleted);

baseSchema.statics.paginate = async function (filter, page, limit, populate = [], select = "") {
  const skip = (page - 1) * limit;
  const total = await this.countDocuments(filter);
  let query = this.find(filter).skip(skip).limit(limit);

  if (populate.length > 0) {
    populate.forEach((pop) => {
      query = query.populate(pop);
    });
  }

  if (select) {
    query = query.select(select);
  }

  const results = await query;

  return {
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
    results,
  };
};

module.exports = baseSchema;
