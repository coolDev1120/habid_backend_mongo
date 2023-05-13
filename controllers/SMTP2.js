const Imap = require("imap");
const imap = require("imap");
const { simpleParser } = require("mailparser");
var mIDs = [];
var emails = [];
const { param } = require("../router");

const EmailModel = require("../mongooseModels/EmailSchema");
const ESettingModel = require("../mongooseModels/ESettingSchema");
const EmailTeamModel = require("../mongooseModels/EmailTeamSchema");
const UserModel = require("../mongooseModels/UserSchema");

basefunction();

setInterval(() => {
  mIDs = [];
  emails = [];
  basefunction();
}, 20000);

// deleteMail()

function deleteMail() {
  const { inspect } = require("util");

  const imap = new Imap({
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    host: process.env.MAIL_HOST,
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });

  function openInbox(cb) {
    imap.openBox("INBOX", true, cb);
  }

  imap.once("ready", function () {
    openInbox(function (err, box) {
      if (err) throw err;
      imap.search(["ALL"], function (err, results) {
        if (err) throw err;
        const f = imap.seq.fetch(results, { bodies: "" });
        f.on("message", function (msg, seqno) {
          console.log("Deleting message %d", seqno);
          const setFlags = imap.seq.setFlags(seqno, "\\Deleted");
        });
        f.on("end", function () {
          imap.expunge(function (err) {
            if (err) throw err;
            console.log("All messages deleted!");
            imap.end();
          });
        });
      });
    });
  });

  imap.once("error", function (err) {
    console.error(err);
  });

  imap.once("end", function () {
    console.log("Connection ended");
  });

  imap.connect();
}

function revieceFile() {
  const Imap = require("imap");
  const simpleParser = require("mailparser").simpleParser;

  const imap = new Imap({
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    host: process.env.MAIL_HOST,
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });

  function openInbox(cb) {
    imap.openBox("INBOX", true, cb);
  }

  imap.once("ready", () => {
    openInbox((err, box) => {
      if (err) throw err;
      imap.search(["ALL"], (err, results) => {
        if (err) throw err;
        const f = imap.fetch(results, { bodies: "" });
        f.on("message", (msg, seqno) => {
          msg.on("body", (stream, info) => {
            simpleParser(stream, (err, parsed) => {
              if (err) throw err;
              if (parsed.attachments.length > 0) {
                // Handle attachments
                parsed.attachments.forEach((attachment) => {
                  console.log(`Received attachment: ${attachment.filename}`);
                });
              }
            });
          });
        });
        f.once("error", (err) => {
          console.log(`Fetch error: ${err}`);
        });
        f.once("end", () => {
          console.log("Done fetching all messages!");
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.log(`IMAP error: ${err}`);
  });

  imap.once("end", () => {
    console.log("IMAP connection ended.");
  });

  imap.connect();
}


async function basefunction() {
  const serverInfo = await ESettingModel.find({ status: 1 });

  for (var i in serverInfo) {
    if (i > 0) {
      setTimeout(async () => {
        await getOne(serverInfo[i]);
      }, 5000);
    } else {
      await getOne(serverInfo[i]);
    }
  }
}

async function getOne(serverInfo) {
  var imap = new Imap({
    user: serverInfo.email,
    password: serverInfo.password,
    host: serverInfo.host,
    port: serverInfo.imap,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });

  imap.connect();

  imap.once("ready", function () {
    imap.openBox("INBOX", function (err) {
      if (err) throw err;

      const fetchOptions = {
        bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
        struct: true,
        envelope: {
          addresses: true,
        },
        markSeen: true,
      };
      imap.search(
        ["UNSEEN", ["SINCE", "2022-09-01 20:17:08"]],
        function (err, results) {
          if (err) throw err;

          const messageIds = (mIDs = results);

          if (messageIds.length > 0) {
            const fetch = imap.fetch(messageIds, fetchOptions);

            fetch.on("message", function (msg) {
              var email = {
                senderName: "",
                senderEmail: "",
                receiverName: "",
                receiverEmail: "",
                date: "",
                subject: "",
                message: "",
              };

              let headerInfo = "";

              msg.on("body", function (stream, info) {
                if (info.which === "TEXT") {
                  stream.on("data", function (chunk) {
                    email.message += chunk.toString("utf8");
                  });
                } else if (
                  info.which === "HEADER.FIELDS (FROM TO SUBJECT DATE)"
                ) {
                  stream.once("data", function (chunk) {
                    headerInfo += chunk.toString("utf8");
                  });
                }
              });

              msg.once("attributes", function (attrs) {
                email.senderName = attrs.envelope.from
                  ? attrs.envelope.from[0].name
                  : "";
                email.senderEmail = `${attrs.envelope.from[0].mailbox}@${attrs.envelope.from[0].host}`;
                email.receiverName = attrs.envelope.to
                  ? attrs.envelope.to[0].name
                  : "";
                email.receiverEmail = `${attrs.envelope.to[0].mailbox}@${attrs.envelope.to[0].host}`;
                email.inReplyTo = attrs.envelope.inReplyTo;
                email.messageId = attrs.envelope.messageId;

                headerInfo = Imap.parseHeader(headerInfo);
                email.date = headerInfo.date;
                email.subject = headerInfo.subject ? headerInfo.subject[0] : "";
              });

              msg.once("end", function () {
                emails.push(email);
              });
            });

            fetch.once("error", function (err) {
              console.log("Fetch error: " + err);
            });

            fetch.once("end", function () {
              getTwo(serverInfo);
              imap.end();
            });
          } else {
            console.log("No emails found.");
            imap.end();
          }
        }
      );
    });
  });

  imap.once("error", function (err) {
    console.log("IMAP error: " + err);
  });

  imap.once("end", function () {
    console.log("Connection ended.");
  });
}

function getTwo(serverInfo) {
  var i = 0;
  const imapConfig = {
    user: serverInfo.email,
    password: serverInfo.password,
    host: serverInfo.host,
    port: serverInfo.imap,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  };

  console.log(imapConfig);

  const client = new imap(imapConfig);

  client.once("ready", () => {
    client.openBox("INBOX", true, (err, box) => {
      if (err) throw err;
      const f = client.seq.fetch(mIDs, { bodies: [""], markSeen: true });
      f.on("message", (msg, seqno) => {
        msg.on("body", async (stream, info) => {
          const body = await simpleParser(stream);
          emails[i].message = body.textAsHtml;
          console.log(emails[i].message);
          i++;
          if (i == mIDs.length) {
            var temp = [];
            for (const i in emails) {
              var params = {
                fromName: emails[i].senderName,
                fromEmail: emails[i].senderEmail,
                toName: emails[i].receiverName,
                toEmail: emails[i].receiverEmail,
                subject: emails[i].subject,
                message: emails[i].message,
                inReplyTo: emails[i].inReplyTo,
                messageId: emails[i].messageId,
                mainId: emails[i].messageId,
                hostname: serverInfo.email,
                category: 0,
              };
              console.log(params);
              if (emails[i].inReplyTo) {
                var selected = await EmailModel.findOne({
                  messageId: emails[i].inReplyTo,
                });
                params.mainId = selected.mainId;
              }
              temp.push(params);
            }
            console.log(temp);

            EmailModel.insertMany(temp)
              .then(() => {
                console.log("Data inserted successfully");
              })
              .catch((error) => {
                console.error("Error inserting data:", error);
              });
          }
        });
      });
      f.once("error", (err) => {
        console.log("Fetch error:", err);
      });
      f.once("end", () => {
        console.log("Fetch completed");
        client.end();
      });
    });
  });

  client.connect();
}

exports.getservice = async (req, res, next) => {
  const { search, page, perpage } = req.body;

  const skip = (page - 1) * perpage;
  const limit = perpage;

  const mails = await EmailModel.aggregate([
    {
      $match: {
        category: 0,
        $or: [
          { fromName: new RegExp(search, "i") },
          { accept: new RegExp(search, "i") },
          { fromEmail: new RegExp(search, "i") },
        ],
      },
    },
    { $sort: { mainId: -1, createdAt: -1 } },
    { $group: { _id: "$mainId", email: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$email" } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await EmailModel.aggregate([
    {
      $match: {
        category: 0,
        $or: [
          { fromName: new RegExp(search, "i") },
          { accept: new RegExp(search, "i") },
          { fromEmail: new RegExp(search, "i") },
        ],
      },
    },
    { $group: { _id: "$mainId" } },
    { $count: "cnt" },
  ]);

  res.send({ data: mails, total: total.length > 0 ? total[0].cnt : 0 });
};


exports.receiveEmail = async (req, res, next) => {
  try {
    const serverInfo = await UserModel.aggregate([
      {
        $match: {
          email: req.body.email,
        },
      },
      {
        $lookup: {
          from: "emailteams",
          localField: "team",
          foreignField: "id",
          as: "team_info",
        },
      },
      {
        $unwind: "$team_info",
      },
      {
        $lookup: {
          from: "esettings",
          localField: "team_info.email",
          foreignField: "id",
          as: "server_info",
        },
      },
      {
        $unwind: "$server_info",
      },
      {
        $project: {
          _id: 0,
          email: "$server_info.email",
        },
      },
    ]);

    const category = req.body.category;
    let search = req.body.search || "";
    const email = req.body.email;

    if (category === "all") {
      const mails = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 0,
            accept: "",
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
              { fromEmail: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            email: { $last: "$email" },
            mainId: { $last: "$mainId" },
            subject: { $last: "$subject" },
            message: { $last: "$message" },
            createdAt: { $last: "$createdAt" },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: (req.body.page - 1) * req.body.perpage,
        },
        {
          $limit: req.body.perpage,
        },
      ]);

      const count = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 0,
            accept: "",
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
              { fromEmail: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({ data: mails, count: count.length > 0 ? count[0].count : 0 });
    } else if (category === "inbox") {
      const mails = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 0,
            accept: email,
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
              { fromEmail: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            email: { $last: "$email" },
            mainId: { $last: "$mainId" },
            subject: { $last: "$subject" },
            message: { $last: "$message" },
            createdAt: { $last: "$createdAt" },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: (req.body.page - 1) * req.body.perpage,
        },
        {
          $limit: req.body.perpage,
        },
      ]);
      const count = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 0,
            accept: email,
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
              { fromEmail: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({ data: mails, count: count.length > 0 ? count[0].count : 0 });
    } else if (category === "sent") {
      const mails = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 1,
            fromEmail: email,
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
              { toEmail: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            email: { $last: "$email" },
            mainId: { $last: "$mainId" },
            subject: { $last: "$subject" },
            message: { $last: "$message" },
            createdAt: { $last: "$createdAt" },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: (req.body.page - 1) * req.body.perpage,
        },
        {
          $limit: req.body.perpage,
        },
      ]);

      const count = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 1,
            fromEmail: email,
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
              { toEmail: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({ data: mails, count: count.length > 0 ? count[0].count : 0 });
    } else if (category === "drafts") {
      const mails = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 2,
            fromEmail: email,
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            email: { $last: "$email" },
            mainId: { $last: "$mainId" },
            subject: { $last: "$subject" },
            message: { $last: "$message" },
            createdAt: { $last: "$createdAt" },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: (req.body.page - 1) * req.body.perpage,
        },
        {
          $limit: req.body.perpage,
        },
      ]);

      const count = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 2,
            fromEmail: email,
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({ data: mails, count: count.length > 0 ? count[0].count : 0 });
    } else if (category === "sent") {
      const mails = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 1,
            fromEmail: email,
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            email: { $last: "$email" },
            mainId: { $last: "$mainId" },
            subject: { $last: "$subject" },
            message: { $last: "$message" },
            createdAt: { $last: "$createdAt" },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: (req.body.page - 1) * req.body.perpage,
        },
        {
          $limit: req.body.perpage,
        },
      ]);

      const count = await EmailModel.aggregate([
        {
          $match: {
            hostname: serverInfo[0]?.email,
            category: 1,
            fromEmail: email,
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { message: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $group: {
            _id: "$mainId",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({ data: mails, count: count.length > 0 ? count[0].count : 0 });
    } else {
      res.status(400).json({ message: "Invalid category" });
    }
  } catch (error) {
    next(error);
  }
};



exports.detailEmail = async (req, res, next) => {
  try {
    const email = await EmailModel.findOne({ _id: req.body.id }); // find email by id using Mongoose
    res.json({ data: email }); // send response with email data
  } catch (err) {
    console.error(err); // log any errors
    res.status(500).json({ error: "Internal server error" }); // send error response
  }
};

exports.sendemailById = async (req, res, next) => {
  try {
    const selected = await EmailModel.findOne({ _id: req.body.id });

    const params = {
      fromName: "Admin",
      fromEmail: selected.toEmail,
      toName: selected.fromName,
      toEmail: selected.fromEmail,
      subject: selected.subject,
      message: req.body.message,
      category: "1",
      accept: req.body.email,
      parentID: req.body.id,
    };

    selected.updateOne({ reply: new Date() });

    const newEmail = new EmailModel(params);
    await newEmail.save();

    res.send({ flag: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ flag: "error" });
  }
};


exports.updateImportant = async (req, res, next) => {
  try {
    const result = await EmailModel.findByIdAndUpdate(req.body.id, {
      isImportant: req.body.value,
    });
    res.send({ flag: "success" });
  } catch (error) {
    next(error);
  }
};


exports.getEmailById = async (req, res, next) => {
  try {
    const result = await EmailModel.findOne({ _id: req.params.id });
    res.send({ datA: result });
  } catch (error) {
    next(error);
  }
};



exports.updateStarred = async (req, res, next) => {
  try {
    const result = await EmailModel.findByIdAndUpdate(req.body.id, {
      isStarred: req.body.value,
    });
    res.send({ flag: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update starred email" });
  }
};


exports.getLabels = async (req, res, next) => {
  var labels = [
    { id: "all", type: "system", name: "genera; inbox", unreadCount: 0 },
    { id: "inbox", type: "system", name: "private inbox", unreadCount: 0 },
    { id: "sent", type: "system", name: "sent", unreadCount: 0 },
    { id: "important", type: "system", name: "important", unreadCount: 0 },
    { id: "starred", type: "system", name: "starred", unreadCount: 0 },
    { id: "accepted", type: "system", name: "starred", unreadCount: 0 },
    { id: "replied", type: "system", name: "starred", unreadCount: 0 },
    { id: "alluser", unreadCount: 0 },
  ];

  try {
    const inboxCount = await EmailModel.countDocuments({ category: 0 });
    labels[1].unreadCount = inboxCount;

    const sentCount = await EmailModel.countDocuments({ category: 1 });
    labels[2].unreadCount = sentCount;

    const acceptedCount = await EmailModel.countDocuments({
      accept: { $ne: "" },
    });
    labels[5].unreadCount = acceptedCount;

    const repliedCount = await EmailModel.countDocuments({
      reply: { $ne: "" },
    });
    labels[6].unreadCount = repliedCount;

    const totalCount = await EmailModel.countDocuments();
    labels[0].unreadCount = totalCount;

    const fromEmailCount = await EmailModel.aggregate([
      { $match: { fromEmail: { $ne: "test@norrberg.net" } } },
      { $group: { _id: "$fromEmail" } },
      { $group: { _id: 1, count: { $sum: 1 } } },
    ]);

    if (fromEmailCount.length > 0) {
      labels[7].unreadCount = fromEmailCount[0].count;
    }
  } catch (error) {
    console.log(error);
  }

  res.send({ val: labels });
};



exports.deleteEmailByID = async (req, res, next) => {
  try {
    await EmailModel.findByIdAndDelete(req.body.id);
    res.send({ flag: "success" });
  } catch (error) {
    next(error);
  }
};



exports.acceptEmailById = async (req, res, next) => {
  try {
    const result = await EmailModel.findOne({ _id: req.body.id });

    if (result.accept) {
      res.send({ flag: "accepted", data: result.accept });
    } else {
      result.accept = req.body.staff;
      result.acceptDate = new Date();
      await result.save();
      res.send({ flag: "success" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Something went wrong" });
  }
};



exports.rejectEmailById = async (req, res, next) => {
  const result = await EmailModel.findOne({ _id: req.body.id });
  result.accept = "";
  result.acceptDate = "";
  await result.save();
  res.send({ flag: "success" });
};



exports.addemailTeam = async (req, res, next) => {
  try {
    const emailTeam = new EmailTeamModel(req.body);
    await emailTeam.save();
    res.send({ flag: "success" });
  } catch (err) {
    next(err);
  }
};


exports.getemailTeam = async function (req, res, next) {
  const result = await EmailTeamModel.find();
  res.send({ result: result });
};



exports.getemailTeamByid = async function (req, res, next) {
  const result = await EmailTeamModel.findById(req.body.id);
  res.send({ result: result });
};



exports.updatemailTeamById = async function (req, res, next) {
  try {
    const updatedData = req.body;
    const result = await EmailTeamModel.findByIdAndUpdate(
      req.body.id,
      updatedData,
      { new: true }
    );
    console.log(result);
    res.send({ flag: "success" });
  } catch (error) {
    next(error);
  }
};



exports.deletemailTeam = async (req, res, next) => {
  try {
    await EmailTeamModel.deleteOne({ _id: req.body.id });
    res.send({ flag: "success" });
  } catch (error) {
    next(error);
  }
};



exports.getEmailTeams = async function (req, res, next) {
  try {
    const result = await EmailTeamModel.find({});
    res.send({ result: result });
  } catch (error) {
    next(error);
  }
};



exports.changeEsettingById = async (req, res, next) => {
  try {
    const result = await ESettingModel.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { status: req.body.val } }
    );
    res.send({ flag: "success" });
  } catch (error) {
    next(error);
  }
};



exports.addemail = async (req, res, next) => {
  try {
    if (req.body.status === "1") {
      await ESettingModel.updateMany({}, { $set: { status: 0 } });
    }

    const newEmail = new ESettingModel(req.body);
    await newEmail.save();

    res.send({ flag: "success" });
  } catch (error) {
    next(error);
  }
};


exports.getemail = async function (req, res, next) {
  try {
    const result = await ESettingModel.find({});

    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};


exports.deletemail = async function (req, res, next) {
  try {
    const result = await ESettingModel.findOneAndDelete({ _id: req.body.id });

    if (!result) {
      return res.status(404).send({ error: "Email not found" });
    }

    res.send({ flag: "success" });
  } catch (error) {
    next(error);
  }
};



exports.getemailsByid = async function (req, res, next) {
  try {
    const result = await ESettingModel.findOne({ _id: req.body.id });

    if (!result) {
      return res.status(404).send({ error: "Email not found" });
    }

    res.send({ data: result });
  } catch (error) {
    next(error);
  }
};



exports.updatemailById = async function (req, res, next) {
  try {
    const email = req.body.email;
    const params = req.body;
    delete params.email; // Removing the email property from the update object

    const result = await ESettingModel.findOneAndUpdate(
      { email: email },
      params
    );

    if (!result) {
      return res.status(404).send({ error: "Email not found" });
    }

    res.send({ flag: "success" });
  } catch (error) {
    next(error);
  }
};


exports.getHostings = async (req, res, next) => {
  try {
    const result = await ESettingModel.find({});
    res.send({ result: result });
  } catch (error) {
    next(error);
  }
};



exports.getRepliedEmailById = async (req, res, next) => {
  try {
    const main = await EmailModel.findOne({ _id: req.body.id });

    let result;
    let flag;
    if (main.accept) {
      flag = true;
      result = await EmailModel.aggregate([
        { $match: { mainId: main.mainId, accept: { $ne: null } } },
        {
          $lookup: {
            from: "users",
            localField: "accept",
            foreignField: "email",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            mainId: 1,
            subject: 1,
            body: 1,
            createdAt: 1,
            username: "$user.username",
          },
        },
      ]);
    } else {
      flag = false;
      result = await EmailModel.find(
        { mainId: main.mainId },
        { _id: 1, mainId: 1, subject: 1, body: 1, createdAt: 1 }
      );
    }

    res.send({ result: result, flag: flag });
  } catch (error) {
    next(error);
  }
};



exports.mailAnalyse = async (req, res, next) => {
  try {
    const reply = await EmailModel.aggregate([
      { $match: { category: 0, reply: { $ne: "" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          cnt: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 10 },
    ]);

    const all = await EmailModel.aggregate([
      { $match: { category: 0 } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          cnt: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 10 },
    ]);

    res.send({ result: { reply: reply, all: all } });
  } catch (error) {
    next(error);
  }
};
