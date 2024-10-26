const { isValidObjectId } = require("mongoose");
const contactsModel = require("./../../models/contacts");
const contactValidator = require("./../../utilities/validators/contacts");

exports.getAll = async (req, res, next) => {
  try {
    const contacts = await contactsModel.find({}).lean();
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getNoAnswers = async (req, res, next) => {
  try {
    const contacts = await contactsModel.find({ isAnswer: 0 }).lean();
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { fullname, issue, phone, email, explain } = req.body;
    const validationResult = contactValidator({
      fullname,
      issue,
      phone,
      email,
      explain,
    });
    if (validationResult !== true) {
      return res.status(400).json(validationResult);
    }

    contactsModel.create({ fullname, issue, phone, email, explain });
    res.status(201).json({ msg: "contacts created" });
  } catch (error) {
    next(error);
  }
};

exports.answer = async (req, res, next) => {
  try {
    const { contactID } = req.params;
    if (!isValidObjectId(contactID)) {
      return res.status(404).json({ msg: "contact not found" });
    }

    const contact = await contactsModel.findOne({ _id: contactID }).lean();
    if (!contact) {
      return res.status(404).json({ msg: "contact not found" });
    }

    const { answer } = req.body;

    await contactsModel.findOneAndUpdate(
      { _id: contactID },
      { $set: { isAnswer: 1, answer } }
    );
    return res.status(201).json({ msg: "contacts answerd" });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { contactID } = req.params;
    if (!isValidObjectId(contactID)) {
      return res.status(404).json({ msg: "contact not found" });
    }

    const contact = await contactsModel
      .findOneAndDelete({ _id: contactID })
      .lean();
    if (!contact) {
      return res.status(404).json({ msg: "contact not found" });
    }

    return res.status(200).json({ msg: "contacts removed" });
  } catch (error) {
    next(error);
  }
};
