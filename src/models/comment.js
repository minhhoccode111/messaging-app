const mongoose = require('mongoose');

const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      length: {
        min: 1,
      },
    },
    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },
    lastModified: {
      type: Date,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { toJSON: { virtuals: true } }
);

CommentSchema.virtual('createdAtFormatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED) + ' - ' + DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.TIME_24_SIMPLE);
});

CommentSchema.virtual('createdAtUnix').get(function () {
  return this.createdAt.getTime();
});

CommentSchema.virtual('lastModifiedFormatted').get(function () {
  if (this.lastModified) return DateTime.fromJSDate(this.lastModified).toLocaleString(DateTime.DATE_MED) + ' - ' + DateTime.fromJSDate(this.lastModified).toLocaleString(DateTime.TIME_24_SIMPLE);
  return null;
});

CommentSchema.virtual('lastModifiedUnix').get(function () {
  if (this.lastModified) return this.lastModified.getTime();
  return null;
});

CommentSchema.virtual('url').get(function () {
  return `/posts/${this.post._id}/comments/${this._id}`;
});

module.exports = mongoose.model('Comment', CommentSchema);
