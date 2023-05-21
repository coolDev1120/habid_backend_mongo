const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const esettingSchema = new Schema({
    host: {
      type: String,
    },
    imap: {
      type: Number,
    },
    smpt: {
      type: Number,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: Number,
    },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

esettingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Esetting', esettingSchema);
