let router = require('express').Router();
var express = require('express');
const FolderSchema = require('../../models/folders');
const NFTSchema = require('../../models/nfts');
const SaleSchema = require('../../models/sale');
const UserSchema = require('../../models/users');
const WhitelistSchema = require('../../models/whitelist');
const mongoose = require('mongoose');
const checkAuth = require('../../helpers/auth');
var app = express();


router.post('/create-new-collection', async(req, res) => {
    try { 
        const { title, username, wallet, category, burn } = req.body;
        const img = req.files.file.name;
        const userImg = req.files.userfile.name;
        console.log(req.files,req.body, "file upload")
        //const img = "img"; const userImg = "userImg";
        if (req.files === null) {
            return res.status(400).json({
                error: "No file was uploaded"
            })
        }
        if (!username) {
            return res.status(400).json({
                error: "Namee is not defined"
            });
        }
        if (!title) {
            return res.status(400).json({
                error: "Title is not defined"
            });
        }
        const file = req.files.file;
        const userAvatar = req.files.userfile; 
        file.mv(`public/collections/${file.name}`, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
            //res.json({ fileName: file.name, filePath: `public/collections/${file.name}` });
          });
        userAvatar.mv(`public/collections/${userAvatar.name}`, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
            //res.json({ fileName: file.name, filePath: `public/collections/${file.name}` });
          });
        let folder = new FolderSchema({
            img,
            userImg,
            title,
            username, 
            wallet, 
            category,  
            burn
        });

        await folder.save();
        res.send({
            message: "Add NFTs and folder successfully"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted",
            message: err        
        });
    }
});

router.post('/get-all-collection', async(req, res) => {
    try {
        let list = await FolderSchema.find({ });
        res.status(200).json({
            collection: list
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-infor-collection', async(req, res) => {
    try {
        let list = await FolderSchema.findOne({ _id: req.body.id });
        res.status(200).json({
            list: list
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-my-collection', async(req, res) => {
    try {
        let list = await FolderSchema.find({ wallet: req.body.wallet });
        res.status(200).json({
            collection: list
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-collection-info', async(req, res) => {console.log(req.body.id)
    try {
        let list = await FolderSchema.findOne({ _id: req.body.id });
        res.status(200).json({
            collection: list
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-category-folder', async(req, res) => {
    try {
        // let list = await FolderSchema.find({
        //     category: req.body.category
        // });
        let list = await FolderSchema.aggregate([
            {
                $match: {
                    category: req.body.category
                }
            },
            {
              $lookup: {
                from: "SaleSchema",
                localField: "_id",
                foreignField: "collectionId",
                as: "Category"
              }
            },
           
          ]);
        // .then((res) => {
        //     console.log(res, "list collection and result")
        // });
      console.log(list, "list collection and folder join")
        res.status(200).json({
            category: list
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/delete-collection', async(req, res) => {
    try {
        const { id } = req.body;
        await FolderSchema.findByIdAndDelete(id);
        res.status(200).json({
            message: "Removed successfully!"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
})

router.post('/update-collection', async(req, res) => {console.log( req.body, "update collection")
    try { 
        const { title, username, wallet, category, burn, id } = req.body;
        const img = req.files.file.name;
        const userImg = req.files.userfile.name;
        console.log(req.files,req.body, "file upload")
        //const img = "img"; const userImg = "userImg";
        if (req.files === null) {
            return res.status(400).json({
                error: "No file was uploaded"
            })
        }
        if (!username) {
            return res.status(400).json({
                error: "Namee is not defined"
            });
        }
        if (!title) {
            return res.status(400).json({
                error: "Title is not defined"
            });
        }
        const file = req.files.file;
        const userAvatar = req.files.userfile; 
        file.mv(`public/collections/${file.name}`, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
            //res.json({ fileName: file.name, filePath: `public/collections/${file.name}` });
          });
        userAvatar.mv(`public/collections/${userAvatar.name}`, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
            //res.json({ fileName: file.name, filePath: `public/collections/${file.name}` });
          });
        let folder = new FolderSchema({
            img,
            userImg,
            title,
            username, 
            wallet, 
            category,  
            burn
        });

        await FolderSchema.findByIdAndUpdate( folder, { id: req.body.id });
        res.send({
            message: "Add NFTs and folder successfully"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted",
            message: err        
        });
    }
});


router.post('/get-collection', async(req, res) => {
    try {
        let list = await FolderSchema.find({wallet: req.body.wallet });
        res.status(200).json({
            collection: list
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-sale-folder-list', async(req, res) => {
    try {
        const { user } = req.body;
        let list = await FolderSchema.find();
        for (let i = list.length - 1; i >= 0; i --) {
            if (!list[i].isPublic && list[i].artist != user.toLowerCase()) {
                const whiteItem = await WhitelistSchema.findOne({ user, folderID: list[i]._id.toString()});
                if (!whiteItem) list.splice(i, 1);
            }
        }

        list.map(item => {
            const ban = NFTSchema.findOne({ folderID: item._id.toString() });
            item.tokenID = ban.tokenID;
        });
        res.status(200).json({
            list
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-folder-detail', async(req, res) => {
    try {
        const { folderID, user, isSale, sort } = req.body;
        const folder = await FolderSchema.findById(folderID);
        if (!folder.isPublic && folder.artist != user.toLowerCase()) {
            const whiteItem = await WhitelistSchema.findOne({ folderID, user });
            if (!whiteItem) throw Error("Not allowed");
        }
        let list = [];
        if (!isSale) {
            list = await NFTSchema.find({ folderID });
            for (let i = list.length - 1; i >=0 ; i --) {
                const saled = await SaleSchema.findOne({ tokenID: list[i].tokenID, action: {$in: ['list', 'auction'] }});
                list[i] = { tokenID: list[i].tokenID };
                if (isSale) {
                    if (saled) list.splice(i, 1);
                }
            }
        }
        
        else {
            const nfts = await NFTSchema.find({ folderID });
            let tokenIDs = [];
            for (let i = nfts.length - 1; i >=0 ; i --) tokenIDs.push(nfts[i].tokenID);
            list = await SaleSchema.find({ tokenID: { $in: tokenIDs }, action: {$in: ['list', 'auction'] }}).sort({ price: sort });
        }
        const artist = await UserSchema.findById(folder.artist);
        res.status(200).json({
            list, artist, description: folder.description
        });
    } catch(err) {
        console.log(err);
        res.status(400).json({
            error: "Your request is restricted"
        })
    }
});

router.post('/get-folder-interface', async(req, res) => {
    try {
        const { folderID } = req.body;
        const folder = await FolderSchema.findById(folderID);
        const artistData = await UserSchema.findById(folder.artist);
        const initialNFT = await NFTSchema.findOne({ folderID });

        res.status(200).json({ list: { folder, artistData }, initialNFT });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        })
    }
});

router.post('/convert-folder-type', async(req, res) => {
    try {
        const token = await checkAuth(req);
        if (!token) {
            return res.status(400).json({
                error: 'Session expired'
            });
        }
        const { id } = token;
        const result = await UserSchema.findById(id);
        if (!result) {
            return res.status(400).json({
                error: "not existing user"
            });    
        }
        const { folderID, status } = req.body;
        await FolderSchema.findByIdAndUpdate(folderID, { isPublic: status});
        if (status == true) {
            await WhitelistSchema.deleteMany({ folderID });
        }
        res.status(200).json({
            message: "Updated successfully"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/add-user-to-whitelist', async(req, res) => {
    try {
        const token = await checkAuth(req);
        if (!token) {
            return res.status(400).json({
                error: 'Session expired'
            });
        }
        const { id } = token;
        const result = await UserSchema.findById(id);
        if (!result) {
            return res.status(400).json({
                error: "not existing user"
            });
        }
        const { folderID, user } = req.body;

        const folder = await FolderSchema.findById(folderID);
        if (folder && folder.isPulic) {
            return res.status(400).json({
                error: "This folder was moved to public"
            });
        }
        
        const existingUser = await UserSchema.findById(user);
        if (!existingUser) {
            return res.status(400).json({
                error: "You are going to add no existing user"
            });
        }

        const isSetted = await WhitelistSchema.findOne({ user, folderID });
        if (isSetted) {
            return res.status(400).json({
                error: "You have already set"
            });
        }

        const newItem = new WhitelistSchema({
            user,
            folderID
        });

        await newItem.save();

        res.status(200).json({
            message: "Added whitelist"
        });
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/remove-user-from-whitelist', async(req, res) => {
    try {
        const token = await checkAuth(req);
        if (!token) {
            return res.status(400).json({
                error: 'Session expired'
            });
        }
        const { id } = token;
        const result = await UserSchema.findById(id);
        if (!result) {
            return res.status(400).json({
                error: "not existing user"
            });
        }
        const { folderID, user } = req.body;

        const folder = await FolderSchema.findById(folderID);
        if (folder && folder.isPulic) {
            return res.status(400).json({
                error: "This folder was moved to public"
            });
        }

        const isSetted = await WhitelistSchema.findOne({ user, folderID });
        if (isSetted) {
            await WhitelistSchema.deleteOne({ user, folderID });
            res.status(200).json({
                message: "Removed from whitelist"
            });
        }

        else {
            res.status(400).json({
                message: "No user exist"
            });
        }
    } catch(err) {
        res.status(400).json({
            error: "Your request is restricted"
        });
    }
});

router.post('/get-private-folder-info', async(req, res) => {
    try {
        const { folderID } = req.body;
        const folderInfo = await FolderSchema.findById(folderID);
        const savedList = await WhitelistSchema.find({ folderID });
        let whiteID = [folderInfo.artist];
        let whiteList = [];
        for await (let item of savedList) {            
            const user = await UserSchema.findById(item.user);
        	whiteID.push(mongoose.Mongoose.ObjectId(item.user));
            whiteList.push(user);
        }

        const restList = await UserSchema.find({ _id: { $nin: whiteID }});
        res.status(200).json({
            whiteList,
            restList,
            folderInfo
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error : "Your request is restricted"
        });
    }
});

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