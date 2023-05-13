const UserModel = require("../mongooseModels/UserSchema");


exports.uploadPorfileImg = async function (req, res, next) {
	// const history = await Tutor.findOne({ where: { email: req.body.email } });
	// await history.update({ image: req.file.path });
	res.send({ success: req.file.path })
}



exports.getAccount = async function (req, res, next) {
	try {
	  const result = await UserModel.findOne({ email: req.body.email });
	  res.send({ data: result });
	} catch (err) {
	  next(err);
	}
}



exports.saveAccount = async function (req, res, next) {
	var update = {
	  username: req.body.username,
	  phone: req.body.phone,
	  gender: req.body.gender,
	  image: req.body.image
	};
	const result = await UserModel.findOne({ email: req.body.email });
	result.set(update);
	await result.save();
	res.send({ flag: "success" });
  };
  



exports.changeAccount = async function (req, res, next) {
	const update = {
	  username: req.body.username,
	  phone: req.body.phone,
	  gender: req.body.gender,
	  image: req.body.image
	};
	console.log(update);
	const result = await UserModel.findOneAndUpdate({ email: req.body.email }, update);
	res.send({ flag: "success" });
  };

  

exports.saveSchedule = async function (req, res, next) {
	try {
	  const result = await UserModel.findOne({ email: req.body.email });
	  result.schedule = req.body.schedule;
	  await result.save();
	  res.send({ flag: "success" });
	} catch (error) {
	  next(error);
	}
  }
  




