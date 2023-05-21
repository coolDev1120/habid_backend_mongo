const mongoose = require('mongoose');
const { Schema } = mongoose;

const settingSchema = new Schema({
  emailScan: {
    type: Date,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

settingSchema.virtual('event_id').get(function () {
    return this._id.toHexString();
  });

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
