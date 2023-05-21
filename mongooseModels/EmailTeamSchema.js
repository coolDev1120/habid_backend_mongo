const mongoose = require("mongoose");

const emailTeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: { type: mongoose.Schema.Types.ObjectId, ref: 'Esetting' },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true },timestamps: true }
);

emailTeamSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const EmailTeam = mongoose.model("EmailTeam", emailTeamSchema);

module.exports = EmailTeam;
