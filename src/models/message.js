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

		// 1 must be null betweeen content and imageLink
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

// TODO check correctness of this google bard code to validate 2 fields userReceive and groupReceive
MessageSchema.validate(async (message) => {
	const hasUser = !!message.userReceive;
	const hasGroup = !!message.groupReceive;
	const hasContent = !!message.content;
	const hasImageLink = !!message.imageLink;

	if (!hasUser && !hasGroup ){
		throw new Error('One of userReceive or groupReceive must be specified.');
	}

	if (hasUser && hasGroup ){
		throw new Error('Cannot send message to both user and group.');
	}

	if (hasContent && hasImageLink ){
		throw new Error('Cannot send message with both content and image link.');
	}

	if (!hasContent && !hasImageLink ){
		throw new Error('One of content or imageLink must be specified.');
	}
});

module.exports = mongoose.model('Message', MessageSchema);

