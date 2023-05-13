const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  email: {
    type: String
  },
  allDay: {
    type: String
  },
  description: {
    type: String
  },
  end: {
    type: String
  },
  id: {
    type: String
  },
  start: {
    type: String
  },
  textColor: {
    type: String
  },
  title: {
    type: String
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

eventSchema.virtual('event_id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Event', eventSchema);
