let router = require('express').Router();
var express = require('express');
const TokenSchema = require('../../models/token');
const mongoose = require('mongoose');
const checkAuth = require('../../helpers/auth');
var app = express();

router.post('/create-pay-token', async(req, res) => {
    try { 
        const { tokenAddr, tokenName, tokenFee } = req.body;
        
        const existingToken = await TokenSchema.findOne({ tokenAddr: tokenAddr });
        if (existingToken) {
            return res.status(200).json({
                exist: true,
                message: "Token has already exist"
            });
        }

        else {
            let token = new TokenSchema({
                tokenAddr,
                tokenName,
                tokenFee
            });

            await token.save();
            res.send({
                exist: false,
                message: "Add tokens successfully"
            });
        }

    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted",
            message: err        
        });
    }
});

router.post('/get-pay-token', async(req, res) => {
    try {
        let list = await TokenSchema.find({ });
        res.status(200).json({
            data: list
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/delete-pay-token', async(req, res) => {
    try {console.log(req.body.id)
        await TokenSchema.findByIdAndDelete(req.body.id);
        res.status(200).json({
            message: "Delete successfully!"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});


router.post('/update-pay-token', async(req, res) => {
    try { 
        const { tokenAddr, tokenName, tokenFee } = req.body;
      
        await TokenSchema.findByIdAndUpdate( req.body.id, {
            tokenAddr: req.body.tokenAddr,
            tokenName: req.body.tokenName,
            tokenFee: req.body.tokenFee
        });
        res.send({
            message: "tokens are updated successfully"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted",
            message: err        
        });
    }
});


module.exports = router;