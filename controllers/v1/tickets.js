const { isValidObjectId } = require("mongoose");
const ticketsModel = require("./../../models/tickets");
const userModel = require("./../../models/users");
const ticketValidator = require("../../utilities/validators/ticket");

exports.getAll = async (req, res, next) => {
  try {
    const tickets = await ticketsModel
      .find({})
      .populate("user", "-password")
      .populate("answerDetails.admin", "-password")
      .lean();
    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

exports.getSingle = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const tickets = await ticketsModel
      .find({ user: _id })
      .populate(
        "answerDetails.admin",
        "-password -phone -email -createdAt -updatedAt -_id"
      )
      .lean();
    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { _id: userID } = req.user;
    const { title, body } = req.body;

    const validation = ticketValidator({ title, body });
    if (validation !== true) {
      return res.status(400).json(validation);
    }

    await ticketsModel.create({ title, body, user: userID });
    return res.status(201).json({ msg: "ticket created" });
  } catch (error) {
    return res.send(error);
  }
};

exports.answer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminID = req.user._id;
    const answer = req.body.answer;
    if (!isValidObjectId(id)) {
      return res.status(404).json({ msg: "ticket not found" });
    }

    const ticket = await ticketsModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            answerDetails: { admin: adminID, answer },
            isAnswer: 1,
          },
        },
        { new: true }
      )
      .lean();
    if (!ticket) {
      return res.status(404).json({ msg: "ticket not found" });
    }

    return res.status(201).json({ msg: "answerd" });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id: tokenID } = req.params;
    if (!isValidObjectId(tokenID)) {
      return res.status(404).json({ msg: "ticket not found" });
    }

    const removedTicket = await ticketsModel.findOneAndDelete({ _id: tokenID });
    if (!removedTicket) {
      return res.status(404).json({ msg: "no ticket found" });
    }

    return res.status(201).json({ msg: "removed" });
  } catch (error) {
    next(error);
  }
};
