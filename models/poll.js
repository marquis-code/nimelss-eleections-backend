const mongoose = require('mongoose')

const optionsSchema = new mongoose.Schema({
    option : {
        type: String,
        required: true,
        unique: true,
    },
    votes : {
        type : Number,
        default : 0
    }

})

const PollSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    author: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true,
        unique: true,
    },
    options : [optionsSchema],
    voted : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    created : {
        type : Date,
        default : Date.now
     },

})

PollSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

PollSchema.set('toJSON', {
    virtuals : true
})

const Poll  = mongoose.model('Poll', PollSchema);
module.exports = Poll