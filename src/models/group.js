const mongoose = require('mongoose');

const { formatDate } = require('./../methods');

const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {

    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      length: {
        min: 1,
        max: 150,
      },
    },

    public: {
      type: Boolean,
      required: true,
    },

    bio: {
      type: String,
      maxLength: 500,
    },

    avatarLink: {
      type: String,
      maxLength: 500,
    },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },

    updatedAt: {
      type: Date,
    },

  },
  { toJSON: { virtuals: true } }
);

GroupSchema.virtual('createdAtFormatted').get(function () {
	return formatDate(this.createdAt);
});

GroupSchema.virtual('createdAtUnix').get(function () {
  return this.createdAt.getTime();
});

GroupSchema.virtual('updatedAtFormatted').get(function () {
  if (this.updatedAt) return formatDate(this.updatedAt);
  return null;
});

GroupSchema.virtual('updatedAtUnix').get(function () {
  if (this.updatedAt) return this.updatedAt.getTime();
  return null;
});

// TODO implement url virtual 

module.exports = mongoose.model('Group', GroupSchema);

