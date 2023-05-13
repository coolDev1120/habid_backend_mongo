const mongoose = require("mongoose");
const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    team_name: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teamSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
