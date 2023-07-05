const Poll = require("../models/poll");
const User = require("../models/user");
const mongoose = require("mongoose");
const _ = require('lodash')

module.exports.fetch_poll = async (req, res) => {
  try {
    const polls = await Poll.find({});
    return res.status(200).json(polls);
  } catch (error) {
    return response.status(500).json({ errorMessage: "Something went wrong!" });
  }
};


module.exports.load_single_poll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('user', ['firstName', 'lastName', 'id'])
    if (!poll) {
      return res.status(400).json({ errorMessage: "Poll was not found" });
    }
    return res.status(200).json(poll);
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

// Increment the vote number of an option of a poll
// Returns a 403 if the user already voted
module.exports.add_vote = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(400).json({ errorMessage: "Poll was not found" });
    }
    const optionIndex = req.params.option;
    const username = req.user.name;
    poll.users_voted.push(username);
    poll.users_voted[optionIndex] = poll.voted[optionIndex] + 1;
    poll.markModified("votes");
    poll.save(function (err, newPoll) {
      if (err) {
        return res
          .status(400)
          .json({ errorMessage: "Something went wrong while saving poll." });
      }
      return res.status(200).json(newPoll);
    });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

// Updates an existing poll in the DB.
module.exports.update_poll = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) {
      return res.status(400).json({ errorMessage: "Something went wrong!" });
    }
    if (!poll) {
      return res.status(404).json({ errorMessage: "Poll was not found!" });
    }
    let updated = _.extend(poll, req.body);
    updated.save(function (err) {
      if (err) {
        return res.status(400).json({ errorMessage: "Something went wrong! while saving poll" });
      }
      returnnres.status(200).json({ successMessage : 'Poll was successfully updated', poll});
    });
  });
};

module.exports.delete_poll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(400).json({ errorMessage: "Poll was not found" });
    }
    await poll.remove();
    return res.status(204).send("Poll was successfully deleted");
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

module.exports.create_poll = async (req, res) => {
  const {_id} = req.decoded;
  const user = await User.findById(_id)

  const {question, options} = req.body;
  try {
    const poll = {
      question,
      user,
      options: options.map((option) => ({
        candidate : option.candidate,
        imageUrl : option.imageUrl,
        academicLevel : option.academicLevel,
        position : option.position,
        gender : option.gender,
        votes : 0
      }))
    }
    let newPoll = new Poll(poll)
    await newPoll.save()
    user.polls.push(newPoll._id)
    await user.save()

    return res.status(200).json({successMessage : 'Poll was succssfully created.', newPoll})
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong!" });
  }
}

module.exports.find_poll = async (req) => {
  try {
    const polls = await Poll.find({
      author : req.params.name
    });
    return response.status(200).json(polls);
  } catch (error) {
    return response.status(500).json({ errorMessage: "Something went wrong!" });
  }
}