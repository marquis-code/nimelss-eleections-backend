const Candidate = require('../models/candidates');
const cloudinary = require('../utils/cloudinary')
const mongoose = require('mongoose')


module.exports.create_handler = async (req, res) => {
    try {
        const {firstName, lastName, position, academicLevel, gender, matric} = req.body
        if(!req.file){
           return res.status(400).json({errorMessage : 'Please upload candidate image.'})
        }

        const candidate = await Candidate.findOne({matric})
        if(candidate){
            return res.status(404).json({errorMessage : `Candidate with matric ${matric} already exist!`})
        }

        const upload_response = await cloudinary.uploader.upload(req.file.path)

        if(upload_response){
            const newCandidate = {
                firstName, lastName, position, academicLevel, gender, matric, avatar : upload_response.url, cloudinary_id : upload_response.public_id
            }

            newCandidate.save().then(() => {
                return res.status(200).json({successMessage : 'Candidate was successfully created!'})
            }).catch(() => {
                return res.status(400).json({errorMessage : 'Something went while saving candidate! please try again later.'})
            })
        }
    } catch (error) {
        return res.status(500).json({errorMessage : 'Something went wrong! please try again later.'})
    }
}


module.exports.fetch_handler = async (req, res) => {
   try {
     const candidates = new Candidate.find()
     if(!candidates){
        return res.status(200).json({successMessage : 'Candidates not available!'})
     }
     return res.status(200).json(candidates)
   } catch (error) {
    return res.status(500).json({errorMessage : 'Something went wrong! please try again later.'})
   }
}

module.exports.load_single_candidate = async (req, res) => {
try {
    const _id = req.params._id
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({errorMessage : 'Invalid Candidate ID'})
    }

    const candidate = Candidate.findById(_id)
    if(!candidate){
        return res.status(400).json({errorMessage : 'Candidates with ID does not exist!'})
    }
    return res.status(200).json(candidate)
} catch (error) {
    return res.status(500).json({errorMessage : 'Something went wrong! please try again later.'})
}
}

module.exports.update_handler = async (req, res) => {
   try {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({errorMessage : 'Invalid Candidate ID'})
    }

    const candidate  = await Candidate.findById(req.params.id)

    if(!candidate){
        return res.status(404).json({errorMessage : 'Candidate not found!'})
    }

    await cloudinary.uploader.destory(candidate.cloudinary_id)

    let result;

    if(req.file){
        result = await cloudinary.uploader.upload(req.file.path)
    }

    const data = {
      firstName : req.body.firstName || candidate.firstName,
      lastName : req.body.lastName || candidate.lastName,
      position : req.body.position || candidate.position,
      academicLevel : req.body.academicLevel || candidate.academicLevel,
      gender : req.body.gender || candidate.gender,
      matric : req.body.matric  || candidate.matric,
      avatar : result.secure_url || candidate.avatar,
      cloudinary_id : result.public_id || candidate.cloudinary_id
    }

    candidate = await Candidate.findByIdAndUpdate(req.params.id, data, {
        new : true
    });

   return res.status(200).json({
    successMessage : 'Candidate information was successfully updated!'
   })
   } catch (error) {
    return res.status(500).json({errorMessage : 'Something went wrong! please try again later.'})
   }
}


module.exports.delete_handler = async (req, res) => {
 try {
    const _id = req.params.id
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({errorMessage : 'Invalid Candidate ID'})
    }

    const candidate = await Candidate.findById(_id)
    await cloudinary.uploader.destory(candidate.cloudinary_id)
    await candidate.remove()
    return res.status(200).json({successMessage : 'Candidate was successfully deleted!'})
 } catch (error) {
    return res.status(500).json({errorMessage : 'Something went wrong! please try again later.'})
 }
}