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
    type: Boolean,
  },
  isStarred: {
    type: Boolean,
  },
  isUnread: {
    type: Boolean,
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
    default :"",
  },
  parentID: { type: Schema.Types.ObjectId, ref: 'Email' },
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
  timestamps: true
});

emailSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Email', emailSchema);
