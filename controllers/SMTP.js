const nodemailer = require("nodemailer");
const UserModel = require("../mongooseModels/UserSchema");
const ESettingModel = require("../mongooseModels/ESettingSchema");
const EmailModel = require("../mongooseModels/EmailSchema");

exports.sendEmail = async (req, res, next) => {
  try {
    const serverInfo = await UserModel.aggregate([
      { $match: { email: req.body.email } },
      {
        $lookup: {
          from: "emailteams",
          localField: "team",
          foreignField: "_id",
          as: "email_team",
        },
      },
      { $unwind: "$email_team" },
      {
        $lookup: {
          from: "esettings",
          localField: "email_team.email",
          foreignField: "_id",
          as: "esetting",
        },
      },
      { $unwind: "$esetting" },
      {
        $project: {
          _id: 0,
          host: "$esetting.host",
          smtp: "$esetting.smtp",
          email: "$esetting.email",
          password: "$esetting.password",
        },
      },
    ]);

    const mailOptions = {
      from: {
        name: req.body.senderName,
        address: serverInfo[0].email,
      },
      to: req.body.receiver,
      subject: req.body.subject,
      inReplyTo: req.body.inReplyTo,
      references: req.body.inReplyTo,
      html: req.body.message,
    };

    console.log(mailOptions);

    const transporter = nodemailer.createTransport({
      name: "thehempcoop.org",
      host: serverInfo[0].host,
      port: serverInfo[0].smtp,
      secure: true, // use TLS
      auth: {
        user: serverInfo[0].email,
        pass: serverInfo[0].password,
      },
    });

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
        res.json({
          success: false,
          flag: "error",
        });
        return;
      } else {
        const selected = await EmailModel.findOne({ _id: req.body.id });
        console.log("selecteddd ---> ", selected);
        const params = {
          fromName: req.body.senderName,
          fromEmail: selected.toEmail,
          toName: selected.fromName,
          toEmail: selected.fromEmail,
          subject: selected.subject,
          message: req.body.message,
          category: "1",
          accept: req.body.email,
          parentID: req.body.id,
          inReplyTo: selected.messageId,
          messageId: info.messageId,
          mainId: selected.mainId,
          hostname: selected.hostname,
          reply: new Date() 
        };
        console.log("param", params);
        await EmailModel.create(params);
        res.json({
          success: true,
          flag: "success",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      flag: "error",
    });
  }
};

exports.sendEmail0 = async (req, res, next) => {
  console.log(req.body)
  try {
    console.log(req.body.email);
    const serverInfo = await UserModel.aggregate([
        { $match: { email: req.body.email } },
        { $lookup: {
            from: 'emailteams',
            localField: 'team',
            foreignField: '_id',
            as: 'team_info'
          }
        },
        { $unwind: '$team_info' },
        { $lookup: {
            from: 'esettings',
            localField: 'team_info.email',
            foreignField: '_id',
            as: 'esettings_info'
          }
        },
        { $unwind: '$esettings_info' },
        { $replaceRoot: { newRoot: '$esettings_info' } }
      ]);
      console.log("serverinfo --->",serverInfo);
    if (!serverInfo.length) {
      return res.status(400).json({
        success: false,
        message: "Server info not found",
      });
    }

    const mailOptions = {
      from: {
        name: req.body.senderName,
        address: serverInfo[0].email,
      },
      to: req.body.receiver,
      subject: req.body.subject,
      inReplyTo: req.body.inReplyTo,
      references: req.body.inReplyTo,
      html: req.body.message,
    };
    console.log(mailOptions);

    const transporter = nodemailer.createTransport({
      name: "thehempcoop.org",
      host: serverInfo[0].host,
      port: serverInfo[0].smtp,
      secure: true, // use TLS
      auth: {
        user: serverInfo[0].email,
        pass: serverInfo[0].password,
      },
    });

    const info = await transporter.sendMail(mailOptions);

    const email = new EmailModel({
      fromName: req.body.senderName,
      fromEmail: serverInfo[0].email,
      toName: "",
      toEmail: req.body.receiver,
      subject: req.body.subject,
      message: req.body.message,
      category: "1",
      accept: req.body.email,
      messageId: info.messageId,
      mainId: info.messageId,
      hostname: serverInfo[0].email,
    });
    await email.save();

    res.json({
      success: true,
      flag: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      flag: "error",
      message: "Something went wrong",
    });
  }
};
