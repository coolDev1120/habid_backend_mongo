const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emailSchema = new Schema({
  fromName: {
    type: String,
  },
  fromEmail: {
    type: String,
  },
  toName: {
    type: String,
  },
  toEmail: {
    type: String,
  },
  subject: {
    type: String,
  },
  isImportant: {
    type: String,
  },
  isStarred: {
    type: String,
  },
  isUnread: {
    type: String,
  },
  labelIds: {
    type: String,
  },
  message: {
    type: String,
  },
  files: {
    type: String,
  },
  category: {
    type: Number,
  },
  reply: {
    type: Date,
  },
  accept: {
    type: String,
  },
  parentID: {
    type: Number,
  },
  inReplyTo: {
    type: String,
  },
  acceptDate: {
    type: Date,
  },
  hostname: {
    type: String,
  },
  messageId: {
    type: String,
  },
  mainId: {
    type: String,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

emailSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Email', emailSchema);
