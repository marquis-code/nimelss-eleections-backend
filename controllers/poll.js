const Poll = require("../models/poll");
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
    const poll = await Poll.findById(req.params.id);
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
    poll.voted.push(username);
    poll.voted[optionIndex] = poll.voted[optionIndex] + 1;
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

// module.exports.create_poll = async (req, res, next) => {
//   const choice = req.body.choice;
//   const identifier = `choices.${choice}.votes`;
//   Poll.update(
//     { _id: req.params.pollId },
//     { $inc: { [identifier]: 1 } },
//     {},
//     (err, numberAffected) => {
//       let Pusher = require("pusher");
//       let pusher = new Pusher({
//         appId: process.env.PUSHER_APP_ID,
//         key: process.env.PUSHER_APP_KEY,
//         secret: process.env.PUSHER_APP_SECRET,
//         cluster: "eu",
//       });

//       let payload = { pollId: req.params.pollId, choice: choice };
//       pusher.trigger("poll-events", "vote", payload, req.body.socketId);

//       res.send("");
//     }
//   );
// };
