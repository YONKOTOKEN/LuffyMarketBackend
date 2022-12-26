let router = require('express').Router();
let emailValidator = require('email-validator');
let walletValidator = require('wallet-address-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const checkAuth = require("../../helpers/auth");
let UserSchema = require('../../models/users');
const { jwt: JWT } = require("../../config/key");

const { CourierClient } = require("@trycourier/courier");
const mongoose = require('mongoose');
const { authSign } = require('../../helpers/check_sign');
const courier = CourierClient({ authorizationToken: "pk_prod_YTMEXMYZA84MWVPTW3KHYS44B1S0"});

router.post('/login', async(req, res) => {
    try {
        const existingUserName = await UserSchema.findOne({ walletAddress: req.body.wallet });
        if (existingUserName) {
                return res.status(200).json({
                    exist: true,
                    data: existingUserName
                });
        }
        else {
            res.status(200).json({
                exist: false
            });
        }
    } catch(err) {
        res.status(400).json({
            error: 'Your request is restricted'
        }); 
    }
});

router.post('/register', async(req, res) => {
    try {
        const { walletAddress } = req.body;

        let user = new UserSchema({
            walletAddress,
        });

        await user.save();

        res.status(200).json({
            status: true,
            message: 'You have registered.',
            user
        })

    } catch(err) {
        console.log(err)
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post(`/coverPhoto`, async(req, res) => {
    try { 
        const { id, name } = req.body;
        const coverPhoto = req.files.coverPhoto;
        coverPhoto.mv(`public/images/${coverPhoto.name}`, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });

        await UserSchema.findOneAndUpdate({ _id: id }, {backavatar: name});

        res.send({
            message: "Update the image successfully"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted",
            message: err        
        });
    }
})

router.post(`/profilePhoto`, async(req, res) => {
    try { 
        const { id, name } = req.body;
        const profilePhoto = req.files.profilePhoto;
        profilePhoto.mv(`public/images/${profilePhoto.name}`, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });

        await UserSchema.findOneAndUpdate({ _id: id }, {avatar: name});

        res.send({
            message: "Update the image successfully"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted",
            message: err        
        });
    }
})

router.post('/verify', async(req, res) => {
    try {
        const { token, email, username } = req.body;
        console.log(email, username);
        let _existed = await UserSchema.findOne({ email, username });
        if (!_existed) {
            return res.status(400).json({
                error: "Your account is unregistered"
            });
        }
        _existed = await UserSchema.findOne({ verifyToken: token, email, username, verified: false});
        if (!_existed) {
            return res.status(400).json({
                error: "Token is expired"
            });
        }
        _existed.verified = true;
        _existed.verifyToken = '';
        await _existed.save();
        res.status(200).json({
            message: "Your account is verfied."
        })
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/forgot', async(req, res) => {
    try {
        const { email } = req.body;
        if (!emailValidator.validate(email)) {
            return res.status(400).json({ error: 'You must enter an correct email address.' });
        }

        const existingUser = await UserSchema.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ error: "We can't find user with your email." });
        }

        const buffer = crypto.randomBytes(48);
        const resetToken = buffer.toString('hex');

        existingUser.resetPasswordToken = resetToken;
        existingUser.resetPasswordExpires = Date.now() + 3600000;

        existingUser.save();

        const { requestId } = await courier.send({
            message: {
                content: {
                    title: "Reset Password",
                    body: `${
                        'You are receiving this because you have requested to reset your password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'https://marketplace.nftdevelopments.site/reset-password/'
                    }${resetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
                },
                data: {
                    joke: ""
                },
                to: {
                    email: email
                },
                timeout: {
                    message: 600000
                }
            }
        });
        res.status(200).json({
            status: true,
            message: 'Please check your email and reset password.'
        })
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
})

router.post('/reset/:token', async(req, res) => {

    try {
        const { password } = req.body;

        const resetUser = await UserSchema.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
    
        if (!resetUser) {
            return res.status(400).json({
            error:
                'Your token has expired. Please attempt to reset your password again.'
            });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        resetUser.password = hash;
        resetUser.resetPasswordToken = undefined;
        resetUser.resetPasswordExpires = undefined;
        resetUser.save();

        res.status(200).json({
            success: true,
            message:
            'Password changed successfully. Please login with your new password.'
        });
    } catch(err) {
        console.error(err);
        res.status(400).json({
            error: "Your request is restricted"
        });
    }

});

router.post('/check-authentication', async(req, res) => {
    const result = await checkAuth(req);
    if (!result) return res.status(400).json({ error: "No validation"});
    const user = await UserSchema.findOne({ _id: mongoose.Types.ObjectId(result.id)});
    res.status(200).json(user);
});

module.exports = router;