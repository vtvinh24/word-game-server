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

async function applyPagination(query, page, limit) {
  const skip = (page - 1) * limit;
  const total = await this.countDocuments(query.getFilter());
  query.skip(skip).limit(limit);
  const results = await query;

  return {
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
    results,
  };
}

baseSchema.statics.get = async function ({ filter, page = 1, limit = 10, populate = [], select = "" }) {
  return this.paginate({ filter, page, limit, populate, select, excludeDeleted: true });
};

baseSchema.statics.paginate = async function ({ filter, page = 1, limit = 10, populate = [], select = "", excludeDeleted = false }) {
  let query = this.find(filter);

  if (excludeDeleted) {
    query = query.where({ deletedAt: null });
  }

  if (populate.length > 0) {
    populate.forEach((pop) => {
      query = query.populate(pop);
    });
  }

  if (select) {
    query = query.select(select);
  }

  return applyPagination.call(this, query, page, limit);
};

module.exports = baseSchema;
