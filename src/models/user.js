const mongoose = require('mongoose');

const { formatDate } = require('./../methods');

const Schema = mongoose.Schema;

const statusEnum = ['online', 'offline', 'busy', 'afk'];

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      length: {
        min: 1,
        max: 50,
      },
    },

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      length: {
        min: 8,
      },
    },

    password: {
      type: String,
      required: true,
      length: {
        min: 8,
        max: 32,
      },
    },

    status: {
      type: String,
			enum: statusEnum,
    },

    bio: {
      type: String,
      maxLength: 500,
    },

    avatarLink: {
      type: String,
      maxLength: 500,
    },

    dateOfBirth: {
      type: Date,
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

UserSchema.virtual('createdAtFormatted').get(function () {
	if (this.createdAt) return formatDate(this.createdAt);
});

UserSchema.virtual('createdAtUnix').get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

UserSchema.virtual('updatedAtFormatted').get(function () {
  if (this.updatedAt) return formatDate(this.updatedAt);
});

UserSchema.virtual('updatedAtUnix').get(function () {
  if (this.updatedAt) return this.updatedAt.getTime();
});

module.exports = mongoose.model('User', UserSchema);
