var Mongoose = require("mongoose");

const { Schema } = Mongoose;

const SaleSchema = Schema({
    nftAddress: {
        type: String
    },
    tokenID: {
        type: Number
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
        type: Date,
        default: Date.now
    },
    signature: {
        type: String
    },
    walletAddress: {
        type: String,
        lowercase: true
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