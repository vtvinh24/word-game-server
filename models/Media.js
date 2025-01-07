const mongoose = require('mongoose');
const baseSchema = require('./Base');

const mediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    /**
     * path: /uploads/2021/07/08/abc.jpg
     */
    path: {
      type: String,
      required: true,
      trim: true,
    },
    /**
     * isUrl: true, false
     * If isUrl is true, the media is a URL, otherwise it is a file.
     */
    isUrl: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: null,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    /**
     * size: bytes
     */
    size: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    url: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  }
);

mediaSchema.add(baseSchema);

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;