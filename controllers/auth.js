const User = require('../models/user');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

module.exports.signup_handler = async (req, res) => {
    try {
        const { firstName, lastName, matric, academicLevel, gender, password } = req.body;
        const user = await User.findOne({ matric })
        if (user) {
            return res.status(400).json({ errorMessage: `User with matric ${matric} already exist` })
        }

        const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName, lastName, matric, academicLevel, gender, password : hashedPassword
        })

        newUser.save().then(() => {
            return res.status(200).json({ successMessage: 'Account was successfully created' })
        }).catch((error) => {
            console.log(error.message)
            return res.status(400).json({ errorMessage: 'Something went wrong while saving user. Please try again!' })
        })
    } catch (error) {
        return res.status(500).json({ errorMessage: 'Something went wrong. Please try again!' })
    }
}

module.exports.login_handler = async (req, res) => {
    try {
        const { matric, password } = req.body;
        const user = await User.findOne({ matric })
        if (!user) {
            return res.status(400).json({ errorMessage: 'Invalid login credentials!' })
        }

        // const isMatch = await user.comparePassword(password)
        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ errorMessage: 'Invalid login credentials!' })
        }

        const jwtPayload = { _id: user._id }
        const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '3 days' })
        return res.status(200).json({
            successMessage: 'Hurray! Login was successful.', token: accessToken, user: {
                firstName: user.firstName,
                lastName: user.lastName,
                matric: user.matric,
                level: user.academicLevel,
                gender: user.gender
            }
        })
    } catch (error) {
        return res.status(500).json({ errorMessage: 'Something went wrong! Please try again.' })
    }
}