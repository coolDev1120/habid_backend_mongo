const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    about: {
      type: String,
    },
    address: {
      type: String,
    },
    automated_email: {
      type: String,
    },
    category: {
      type: Number,
    },
    city: {
      type: String,
    },
    postcode: {
      type: String,
    },
    company: {
      type: Number,
    },
    country_state: {
      type: String,
    },
    customer_name: {
      type: String,
    },
    email: {
      type: String,
    },
    facebook_id: {
      type: String,
    },
    house: {
      type: String,
    },
    landline: {
      type: String,
    },
    linkedin_id: {
      type: String,
    },
    other_contact: {
      type: String,
    },
    phone: {
      type: String,
    },
    skype_name: {
      type: String,
    },
    subcategory: {
      type: Number,
    },
    twitter_username: {
      type: String,
    },
    website: {
      type: String,
    },
    where_find: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// define virtual field 'id' which will return '_id' as 'id'
ContactSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
