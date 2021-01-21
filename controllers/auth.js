const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    createJWT
} = require('../utils/auth');

exports.signup = (req, res, next) => {
    let { fname, lname, email, password, password_confirmation } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(422).json({ errors: [{ user: "email already exists" }] });
            } else {
                const user = new User({
                    fname: fname,
                    lname: lname,
                    email: email,
                    password: password,
                });
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) console.log(err);
                        user.password = hash;
                        user.save()
                            .then(response => {
                                res.status(200).json({
                                    success: true,
                                    result: response
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                    });
                });
            }
        }).catch(err => {
            res.status(500).json({
                errors: [{ error: 'Something went wrong' }]
            });
        })
}

exports.signin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.status(404).json({
                errors: [{ user: "not found" }]
            });
        } else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (!isMatch) {
                    return res.status(400).json({ errors: [{ incorrect: 'username or password is incorrect' }] })
                }

                const access_token = createJWT(
                    user.email,
                    user._id,
                    3600
                );

                jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        res.status(500).json({ errors: err });
                    }

                    if (decoded) {
                        return res.status(200).json({
                            success: true,
                            token: access_token,
                            message: user
                        });
                    }
                }).catch(err => {
                    res.status(500).json({ errors: err })
                });
            }).catch(err => {
                res.status(500).json({ errors: err })
            });
        }
    });
}