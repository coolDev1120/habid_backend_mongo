const UserModel = require("../mongooseModels/UserSchema");

exports.getusers = async function (req, res, next) {
	try {
	  const users = await UserModel.find({});
	  res.json({ flag: "success", data: users });
	} catch (err) {
	  console.error(err);
	}
  };



