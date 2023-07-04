const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const AdminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    matric: {
        type: String,
        required: true,
        unique: true
    },
    academicLevel: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        emum: ['male', 'female']
    },
    password: {
        type: String,
        required: true
    },
    created : {
       type : Date,
       default : Date.now
    },
    role: {
        type: String,
        default: 'admin',
        enum: ["admin", "super_admin"]
       }
})

AdminSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

AdminSchema.set('toJSON', {
    virtuals : true
})



const Admin  = mongoose.model('Admin', AdminSchema);
module.exports = Admin