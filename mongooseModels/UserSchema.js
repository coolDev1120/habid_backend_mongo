const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  phone: {
    type: String
  },
  role: {
    type: String
  },
  accountype: {
    type: String
  },
  colourCode: {
    type: String
  },
  staff: {
    type: String
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTeam' },
  permissions: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  });

// define virtual field 'id' which will return '_id' as 'id'
UserSchema.virtual('id').get(function() {
return this._id.toHexString();
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
