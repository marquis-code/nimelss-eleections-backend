const jsonwebtoken = require("jsonwebtoken");
const Admin = require("../models/admin");

const checkAdmin = (req, res, next) => {                  
    try {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ errorMessage: err.message });
                }
                if (decodedToken.role !== 'admin') {
                    return res.status(401).json({ errorMessage: "Access Denied. You need Admin role access." });
                }

                // if (req.body.id && req.body.id !== decodedToken._id) {
                //     return res.status(401).json({ errorMessage: "Invalid Admin ID" });
                // }

                Admin.findById(decodedToken.id).then((user) => {
                    res.locals.user = user;
                    next();
                }).catch((err) => {
                    return res.status(500).json({ errorMessage: err.message })
                })
            }
            )
        } else {
            return res.status(401).json({ errorMessage: "Access denied." });
        }
    } catch (error) {
        return res.status(500).json({ errorMessage: "Something went wrong!" });
    }
};

const checkSuperAdmin = (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ errorMessage: err.message });
                }

                if (decodedToken.role !== 'super_admin') {
                    return res.status(401).json({ errorMessage: "Access Denied. You need super admin role access." });
                }
                Admin.findById(decodedToken.id).then((user) => {
                    res.locals.user = user;
                    next();
                }).catch((err) => {
                    return res.status(500).json({ errorMessage: err.message })
                })
            }
            )
        } else {
            return res.status(401).json({ errorMessage: "Access denied." });
        }
    } catch (error) {
        return res.status(500).json({ errorMessage: "Something went wrong!" });
    }
}

module.exports = { checkAdmin, checkSuperAdmin };