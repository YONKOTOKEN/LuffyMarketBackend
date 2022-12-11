var Mongoose = require("mongoose");

const { Schema } = Mongoose;

const SaleSchema = Schema({
    nftAddress: {
        type: String
    },
    tokenID: {
        type: Number
    },
    collectionId: {
        type: String
    },
    payableAddress: {
        type: String
    },
    selltype: {
        type: Array
    },
    price: {
        type: Array
    },
    amount: {
        type: Number
    },
    divid: {
        type: String,
        default: 'fixed'
    },
    timeStamp: {
        type: Number,
       // default: Date.now
    },
    signature: {
        type: String
    },
    walletAddress: {
        type: String,
        lowercase: true
    },
    burn_Method: {
        type: Boolean,
    },
    tokenUri: {
        type: String
    },
    updated_at: {
        type: Date
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('Sale', SaleSchema);