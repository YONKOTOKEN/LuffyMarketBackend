let router =  require('express').Router();
const { listSign, auctionSign, offerSign, processOfferSign } = require('../../helpers/check_sign');
const HistorySchema = require('../../models/history');
const SaleSchema = require('../../models/sale');
const ActivitySchema = require("../../models/activity-log");
const UserSchema = require("../../models/users");
const FolderSchema = require("../../models/folders");
const WhitelistSchema = require('../../models/whitelist');
const NFTSchema = require("../../models/nfts");

router.post('/list', async(req, res) => {console.log(req.body, "list===========>");
    try {
        const { 
            nftAddress, 
            tokenID,  
            payableAddress, 
            selltype,
            price, 
            divid,
            timeStamp, 
            signature, 
            walletAddress,
            amount,
            burn_Method ,
            tokenUri
        } = req.body;

        let _sale = new SaleSchema({
            nftAddress,
            tokenID,
            payableAddress,
            selltype,
            price,
            divid,
            timeStamp,
            signature,
            walletAddress,
            amount,
            burn_Method,
            tokenUri
        });

        await _sale.save(function(err, result){console.log(err, "list_save")});
        res.status(200).json({
            message: "Listed successfully"
        });

    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
})

router.post('/get-sale-list', async(req, res) => {
    try {
        const { walletAddress } = req.body;
        
        let fixedData = await SaleSchema.find({ });
        res.status(200).json({ 
            list: fixedData
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/item-sale-list', async(req, res) => {
    try {
        const { walletAddress } = req.body;
        
        let fixedData = await SaleSchema.findOne({ _id: req.body.id });
        res.status(200).json({ 
            list: fixedData
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-bid-list', async(req, res) => {
    try {
        const { walletAddress } = req.body;
        
        let expiredAuction = await SaleSchema.find({
            action: 'auction',
            deadline: {
                $lt: Date.now()
            }
        })

        expiredAuction.map(async(item) => {
            await SaleSchema.deleteMany({
                tokenID: item.tokenID,
                action: ['offer', 'auction']
            });
        });

        let saleList = await SaleSchema.find({ walletAddress, action: "auction" });
        let bidList = {};
        saleList.map(async(item, index) => {
            const bid = await SaleSchema.find({ tokenID: item.tokenID, action: 'offer' });
            if (bid.length) {
                bidList[item.walletAddress] = bid;
            } else saleList.splice(index, 1);
        })

        res.status(200).json({
            nfts: saleList,
            bids: bidList
        })

    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});



module.exports = router;