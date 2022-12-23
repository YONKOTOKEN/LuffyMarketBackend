let router = require('express').Router();
var express = require('express');
const BidSchema = require('../../models/bid');
const NFTSchema = require('../../models/nfts');
const mongoose = require('mongoose');
const checkAuth = require('../../helpers/auth');
var app = express();

router.post('/create-new-bid', async(req, res) => {
    try { 
        const { nftAddress, nftId, seller, bidPrice, tokenName, tokenAddr, tokenAmount, buyer } = req.body;
        console.log(req.body, "save bid list")
        if (!tokenAmount) {
            return res.status(400).json({
                error: "Enter Token Amount!"
            });
        }
        let bid = new BidSchema({
            nftAddress,
            nftId,
            seller,
            bidPrice,
            tokenName, 
            tokenAddr, 
            tokenAmount, 
            buyer
        });

        await bid.save();
        res.send({
            message: "NFTs bid successfully"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted",
            message: err        
        });
    }
});

router.post('/get-bid-list', async(req, res) => {
    try {
        const { nftAddress, nftId, seller } = req.body;
        
        bidData = await BidSchema.find({
            nftAddress: nftAddress,
            nftId: nftId,
            seller: seller
        });
        
        res.status(200).json({ 
            list: bidData
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/max-bid-list', async(req, res) => {

    try {
        const { nftAddress, nftId, seller } = req.body;
        BidSchema.findOne(
            {nftAddress: nftAddress, nftId: nftId, seller: seller}
        ).sort(
            { "tokenAmount":-1}
        ).exec(function(err, doc){
            var max = doc?.tokenAmount;
            res.status(200).json({
                list: doc
            });
        })
        
    } catch(err) {
        console.log("Error: ",err)
        res.status(400).json({
            error: "Your request is restricted"
        });
    } 
})

router.post('/delete-bid-list', async(req, res) => {console.log(req.body,"id====>")
    try {
        const { id } = req.body;
        await BidSchema.findByIdAndDelete(id);
        res.status(200).json({
            message: "Removed successfully!"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
})

router.post('/update-metadata', async(req, res) => {
    try {
        const { tokenID, metadata } = req.body;
        const _exist = await NFTSchema.findOne({ tokenID });
        if (_exist) {
            if (!_exist.metadata || !_exist.metadata.length) {
                const result = await NFTSchema.updateOne({ tokenID }, {metadata: JSON.stringify(metadata)});
                console.log(result);
                res.status(200).json({
                    status: true
                });
            }
            res.status(200).json({
                status: false,
                message: "already set"
            });
        }
        else {
            res.status(200).json({
                status: false,
                message: "no nft exist"
            });
        }
    } catch(err) {
        res.status(200).json({
            status: false
        });
    }
});

module.exports = router;