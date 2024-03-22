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
        min: 8,
        max: 60,
      },
    },

    public: {
      type: Boolean,
      required: true,
    },

    bio: {
      type: String,
      length: {
        min: 1,
        max: 260,
      },
      required: true,
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
	if (this.createdAt) return formatDate(this.createdAt);
});

GroupSchema.virtual('createdAtUnix').get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

GroupSchema.virtual('updatedAtFormatted').get(function () {
  if (this.updatedAt) return formatDate(this.updatedAt);
});

GroupSchema.virtual('updatedAtUnix').get(function () {
  if (this.updatedAt) return this.updatedAt.getTime();
});

// TODO implement url virtual 

module.exports = mongoose.model('Group', GroupSchema);

