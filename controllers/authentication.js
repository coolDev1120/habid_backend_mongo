const jwt = require('jwt-simple');
const config = require('../config');
const { Op } = require("sequelize");

const UserModel = require("../mongooseModels/UserSchema");
const md5 = require('md5');
const { compareSync } = require('bcrypt-nodejs');
const nodemailer = require('nodemailer')


function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({
		id: user.id,
		name: user.username,
		email: user.email,
		image: user.image,
		agent: user.agent,
		gender: user.gender,
		sub: user.id,
		iat: timestamp,
		role: user.role
	}, config.secret);
}


const MAIL_HOST = 'mail.meta-labs.space'
const MAIL_PORT = 465
const MAIL_USER = 'administrator@meta-labs.space'
const MAIL_PASSWORD = "6Gw2ksxVf_;s"

exports.resetPassword = async function (req, res, next) {
	const verify_link = "https://raffle.meta-labs.space/player/verify/";
	var mailOptions = {
		from: MAIL_USER,
		to: 'astjin2@gmail.com',
		subject: 'Meta Labs Space Email Verification',
		html: '<h3>Thanks for applying for Meta Labs Space!</h3>' +
			'<p>Please verify your email address by clicking the button below.</p>' +
			'<a href="' + verify_link + '">Confirm email address</a><br></br>' +
			'<p>Thanks!</p>' +
			'<p>Meta Labs Space Team</p>'
	};

	const transporter = nodemailer.createTransport({
		//this is the authentication for sending email. this is change for git.
		host: MAIL_HOST,
		port: 465,
		secure: true, // use TLS                
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASSWORD,
		},
	})

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			res.json({
				success: false,
				flag: "error",
			});
			return;
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

	res.json({
		success: true,
		flag: "success",
	});
}


exports.signin = async function (req, res, next) {
	const usercheck = await UserModel.findOne({ email: req.body.email });
	console.log(req.body.email)
	if (!usercheck) {
	  res.send({ flag: "nouser", error: "Your email is not registered" });
	  return
	}
  
	const result = await UserModel.findOne({
	  email: req.body.email,
	  password: md5(req.body.password)
	});
	if (!result) {
	  res.send({ flag: "nomatch", error: "Email or username is incorrect" });
	  return
	}
	else {
	  res.send({ flag: "success", token: tokenForUser(result) });
	}
  }
  



exports.signup = async function (req, res, next) {
	console.log(req.body);
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password' });
	}

	const result = await UserModel.findOne({ email: email });
  	const result1 = await UserModel.findOne({ username: req.body.username });
	if (result) {
		return res.status(422).send({ error: 'Email is in use' });
	}
	else if (result1) {
		return res.status(422).send({ error: 'Username is in use' });
	}
	else {
		const user = new UserModel({
			username: req.body.username,
			firstname: req.body.firstName,
			lastname: req.body.lastName,
			email: email,
			password: md5(password),
			agent: req.body.agent,
			gender: req.body.gender,
			phone: req.body.phone,
			country: req.body.country,
			dateAdded: '2023-01-01',
			role: 'user'
		});
		await user.save();
		res.send({ flag: "success" });
	}
}



exports.changePassword = async function (req, res, next) {
	const user = await UserModel.findOne({ email: req.body.email });
	if (!user) {
	  res.send({ flag: "fail", message: "User not found" });
	  return;
	}
  
	if (user.password !== md5(req.body.oldPassword)) {
	  res.send({ flag: "fail", message: "Password doesn't match your current password" });
	  return;
	}
  
	user.password = md5(req.body.newPassword);
	await user.save();
  
	res.send({ flag: "success" });
  };


exports.updateAccount = async function (req, res, next) {
	var update = {
	  username: req.body.displayName,
	  firstname: req.body.firstName,
	  lastname: req.body.lastName,
	  image: req.body.image,
	};
  
	const result = await UserModel.findOneAndUpdate(
	  { email: req.body.email },
	  update,
	  { new: true }
	);
	
	res.send({ flag: "success", token: tokenForUser(result) });
  };


exports.addaccount = async function (req, res, next) {
	const result = await UserModel.findOne({ email: req.body.email });
	const result1 = await UserModel.findOne({ username: req.body.username });
	var update = req.body;
	update.password = md5(update.password);
	if (result) {
	  return res.send({ flag: "failed", message: "Email is in use" });
	} else if (result1) {
	  return res.send({ flag: "failed", message: "Username is in use" });
	} else {
	  await UserModel.create(update);
	  res.send({ flag: "success" });
	}
  };



exports.deleteAccount = async function (req, res, next) {
	try {
	  const deletedUser = await UserModel.findByIdAndDelete(req.body.id);
	  if (!deletedUser) {
		return res.send({ flag: "failed", message: "User not found" });
	  }
	  res.send({ flag: "success" });
	} catch (err) {
	  console.log(err);
	  res.send({ flag: "failed", message: "Error occurred while deleting user" });
	}
  }



exports.getAccountById = async function (req, res, next) {
	try {
		const result = await UserModel.findById(req.body.id);
		res.send({ data: [result] });
	} catch (err) {
		console.log(err);
	}
}

exports.updateAccountById = async function (req, res, next) {
	console.log(req.body);
	var update = {
		username: req.body.username ? req.body.username : '',
		team: req.body.team ? req.body.team : '',
		phone: req.body.phone ? req.body.phone : '',
		accountype: req.body.accountype ? req.body.accountype : '',
		staff: req.body.staff ? req.body.staff : '',
		dateAdded: req.body.dateAdded ? req.body.dateAdded : '',
		role: req.body.role ? req.body.role : '',	
	};
	if (req.body.colourCode) {
		update.colourCode = req.body.colourCode;
	}
	if (req.body.password) {
		update.password = md5(req.body.password);
	}
	const result1 = await UserModel.findOne({ username: req.body.username , email: { $ne: req.body.email }  });
	if (result1) {
		return res.send({ flag: "failed", message: "Username is in use" });
	} else {
		const result1 = await UserModel.findOne({ email: req.body.email });

		if (!result1) {
			return res.send({ flag: "failed", message: "User not found" });
		}
		const response = await UserModel.updateOne({_id : result1._id},{ $set : update})
		res.send({ flag: "success" });
	}
};


exports.changeRoleById = async (req, res, next) => {
	const result = await UserModel.findOneAndUpdate(
        { _id: req.body.id },
        { role: req.body.val },
        { new: true }
    );

    res.send({ flag: "success" })
}