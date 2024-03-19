const mongoose = require('mongoose');

const { formatDate } = require('./../methods');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 1 must be null between userReceive and groupReceive
    userReceive: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    groupReceive: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },

    // 1 must be null between content and imageLink
    content: {
      type: String,
      required: true,
    },

    imageLink: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },
  },
  { toJSON: { virtuals: true } }
);

MessageSchema.virtual('createdAtFormatted').get(function () {
  return formatDate(this.createdAt);
});

MessageSchema.virtual('createdAtUnix').get(function () {
  return this.createdAt.getTime();
});

// TODO implement url virtual

module.exports = mongoose.model('Message', MessageSchema);
