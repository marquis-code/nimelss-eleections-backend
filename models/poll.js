const mongoose = require('mongoose')

const optionsSchema = new mongoose.Schema({
    candidate : {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl : {
        type: String,
        required: true,
    },
    academicLevel : {
        type: String,
        required: true,
    },
    position : {
        type: String,
        required: true,
    },
    gender : {
        type: String,
        required: true,
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
    question : {
        type: String,
        required: true
    },
    options : [optionsSchema],
    users_voted : [{
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