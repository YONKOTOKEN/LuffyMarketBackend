const UserSchema = require("../../models/users");
const ActivitySchema = require("../../models/activity-log");
const router = require("express").Router();

router.post('/create-log', async(req, res) => {
    const { nftAddress, nftId, nftName, from, to, type, tokenAddr, tokenPrice } = req.body;

    let logs = new ActivitySchema({
        nftAddress,
        nftId,
        nftName,
        from,
        to,
        type,
        tokenAddr,
        tokenPrice
    });

    await logs.save();

    res.status(200).json({
        success: true
    })
});

router.post('/get-logs', async(req, res) => {
    try {
        if(req.body.wallet == 'all') {
            let collectionData;
            collectionData = await ActivitySchema.find({ });
            res.status(200).json({ 
                list: collectionData
            });
        }
        else {
            let collectionData;
            collectionData = await ActivitySchema.find({
                $or: [
                    {
                        from: req.body.wallet
                    },
                    {
                        to: req.body.wallet
                    }
                ]
            });
            res.status(200).json({ 
                list: collectionData
            });
        }
       
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-nft-logs', async(req, res) => {
    try {
        let activityData;
            if(req.body.type === "all") {
                activityData = await ActivitySchema.find({
                    nftAddress: req.body.nftAddress,
                    nftId: req.body.nftId
                });
            }
            else {
                activityData = await ActivitySchema.find({
                    nftAddress: req.body.nftAddress,
                    nftId: req.body.nftId,
                    type: req.body.type
                });
            }
            res.status(200).json({ 
                data: activityData
            });
       
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

// router.get('/get-logs', async(req, res) => {
//     const { b, type } = req.query;
//     const query = type ? { type } : {};
//     let list = await ActivitySchema.find(query);
//     list = list.slice(Number(b), Number(b) + 5);
//     for await (let item of list) {
//         let user = await UserSchema.findOne({ walletAddress: item.walletAddress });
//         let avatar = user ? user.avatar : "empty-avatar.png";
//         item._doc = { ...item._doc, avatar: avatar, firstName: user ? user.firstName : '???', lastName: user ? user.lastName : "???"};
//     }

//     res.status(200).json(list);
// });

router.post('/get-likes', async(req,res) => {
    const { tokenID, walletAddress } = req.body;
    try {
        const liked = await ActivitySchema.count({ tokenID: tokenID, type: "9" });
        const disLiked = await ActivitySchema.count({ tokenID: tokenID, type: "10" });
        const lastAct = await ActivitySchema.find({ walletAddress, tokenID, type: { $in: ["9", "10"]} }, {}, { sort: { 'created_at' : 1 } })
        res.status(200).json({
            liked: (liked - disLiked) < 0 ? 0 : (liked - disLiked),
            lastAct: lastAct.length ? lastAct[lastAct.length - 1].type : "10"
        });

    } catch(err) {
        res.status(200).json({
            liked: 0,
            lastAct: "10"
        })
    }
})

router.post('/get-top-sellers', async(req, res) => {
    try {
        let seller = await ActivitySchema.aggregate([
            {
                $match: {
                    type: "0"
                }
            },
            {
                $group:
                   {
                    _id: "$walletAddress",
                    price: { $sum: "$price" }
                }
            }
        ]).sort({ price: 'desc', _id: 'desc'}).limit(12);
        
        let list = [];
        for await (let item of seller) {
            let user = await UserSchema.findOne({ walletAddress: item._id });
            if (!user) {
                item = {
                    avatar: "empty-avatar.png",
                    firstName: "----",
                    lastName: "---",
                    ...item
                };
            }
            list.push({ ...user?._doc, ...item});
        }

        res.status(200).json(list);
    } catch(err) {
        console.log(err);
    }
})
module.exports = router;