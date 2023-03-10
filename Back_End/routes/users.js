const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.route("/")
    .get((req, res) => {
        User.find({}).populate({
            path: "validateLog",
            select:{user: 0},
            populate: {
                path: "animation",
                select: {
                    validateLog: 0
                }
            }
        }).then((success, err) => {
            if (success) res.send(success)
            else res.send(err)
        })
    })

router.route("/add")
    .post((req, res) => {
        const newUser = User({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
            validateLog: req.body.validateLog
        })
        newUser.save().then((success, err) => {
            if (success) res.send(success)
            else res.send(err)
        })
    })


router.route("/validate/:userID")
    // User Log
    .put((req, res) => {
        User.findByIdAndUpdate({ _id: req.params.userID }, { $push: { validateLog: req.body.validateID } }, { new: true }).then((doc, err) => {
            if (doc) res.send(doc)
            else res.json(err)
        })
    })

module.exports = router