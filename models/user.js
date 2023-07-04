const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
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
    polls : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Poll'
    }]

})

UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

UserSchema.set('toJSON', {
    virtuals : true
})

UserSchema.pre('save', async function(next){
  try {
     if(this.isModified('password')){
        return next()
     }
     const hashed = await bcrypt.hash(this.password, 10);
     this.password = hashed
     return next()
  } catch (error) {
   return next(error)
  }
})

UserSchema.methods.comparePassword = async function(attempt, next){
  try {
    return bcrypt.compare(attempt, this.password)
  } catch (error) {
     next(error)
  }
}

const User  = mongoose.model('User', UserSchema);
module.exports = User