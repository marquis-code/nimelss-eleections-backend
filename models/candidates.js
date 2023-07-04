const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
   firstName :{
     type : String,
     required : true
   },
   lastName :{
    type : String,
    required : true
  },
  matric :{
    type : String,
    required : true
  },
   position : {
    type : String,
    required : true,
    emum : ['president', 'vice president', 'general secretary', 'assistant general secretart', 'public relations officer', 'sport secretary', 'social secretary', 'welfare secretary', 'treasurer', 'academic secretary', 'senate member', 'financial secretary']
   },
   academicLevel : {
    type : String,
    required : true,
    enum : ['300','400','500']
   },
   gender : {
    type : String,
    required : true,
    enum : ['male','female']
   },
   avatar : {
    type : String,
    required : true
   },
   cloudinary_id : {
    type : String,
    required : true
   }
})

CandidateSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

CandidateSchema.set('toJSON', {
    virtuals : true
})

const Candidate = mongoose.model('Candidate', CandidateSchema)

module.exports = Candidate