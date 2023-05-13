const ContactModel = require("../mongooseModels/ContactSchema");

exports.add = async function (req, res, next) {
  try {
    const newContact = new ContactModel(req.body);
    await newContact.save();
    res.send({ flag: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Failed to add contact." });
  }
};

exports.get = async function (req, res, next) {
  try {
    const { current, perpage, search, order, field, option } = req.body;
    const skip = perpage * (current - 1);
    const sort = order === "descend" ? `-${field}` : field;

    // Build the filter object based on the option array
    const filter = {};
    for (const { name, value } of option) {
      if (value) {
        filter[name] = value;
      }
    }

    // Count the total number of documents that match the filter
    const total = await ContactModel.countDocuments(filter);

    // Fetch the paginated documents that match the filter and search query
    const contacts = await ContactModel.find({
      ...filter,
      $or: [
        { customer_name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { postcode: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(perpage)
      .sort(sort);

    // Return the data and total as JSON
    res.json({ data: contacts, total });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Failed to fetch contacts." });
  }
};

exports.delete = async function (req, res, next) {
  try {
    await ContactModel.findByIdAndDelete(req.body.id);
    res.send({ flag: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getByid = async function (req, res, next) {
  try {
    const contact = await ContactModel.findById(req.body.id);
    res.json({ data: contact });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.edit = async function (req, res, next) {
  try {
    const contact = await ContactModel.findById(req.body.id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    contact.set(req.body.value);
    await contact.save();
    res.send({ flag: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal server error" });
  }
};
