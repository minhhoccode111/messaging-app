const mongoose = require('mongoose');

const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

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
    isCreator: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },
  },
  { toJSON: { virtuals: true } }
);

UserSchema.virtual('createdAtFormatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED) + ' - ' + DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.TIME_24_SIMPLE);
});

module.exports = mongoose.model('User', UserSchema);
