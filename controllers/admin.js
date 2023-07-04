const Admin = require('../models/admin');
const jwt = require('jsonwebtoken')

module.exports.signup_handler = async (req, res) => {
    try {
        const { firstName, lastName, matric, academicLevel, gender, password, role } = req.body;
        const user = Admin.findOne({ matric })
        if (user) {
            return res.status(400).json({ errorMessage: `User with matric ${matric} already exist` })
        }

        const newAdmin = new Admin({
            firstName, lastName, matric, academicLevel, gender, password, role : role || 'admin'
        })

        newAdmin.save().then(() => {
            return res.status(200).json({ successMessage: 'Admin sccount was successfully created' })
        }).catch(() => {
            return res.status(400).json({ errorMessage: 'Something went wrong while saving user. Please try again!' })
        })
    } catch (error) {
        return res.status(500).json({ errorMessage: 'Something went wrong. Please try again!' })
    }
}

module.exports.login_handler = async (req, res) => {
    try {
        const { matric, password } = req.body;
        const admin = Admin.findOne({ matric })
        if (!admin) {
            return res.status(400).json({ errorMessage: 'Invalid login credentials!' })
        }

        const isMatch = await admin.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ errorMessage: 'Invalid login credentials!' })
        }

        const jwtPayload = { _id: user._id }
        const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '3 days' })
        return res.status(200).json({
            successMessage: 'Hurray! Login was successful.', token: accessToken, user: {
                firstName: admin.firstName,
                lastName: admin.lastName,
                matric: admin.matric,
                level: admin.academicLevel,
                gender: admin.gender,
                role : admin.role
            }
        })
    } catch (error) {
        return res.status(500).json({ errorMessage: 'Something went wrong! Please try again.' })
    }
}