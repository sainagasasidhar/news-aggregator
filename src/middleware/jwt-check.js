const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization, "user_signup", function(err, decode) {
            if (err) {
                req.user = undefined;
                req.message = "Header verification failed";
                next();
            } else {
                next();
            }
        })
    } else {
        req.user = undefined;
        req.message = "Authorization header not found";
        next();
    }
}

module.exports = verifyToken;