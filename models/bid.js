var Mongoose = require("mongoose");

const { Schema } = Mongoose;

const BidSchema = Schema({
    nftAddress: {
        type: String
    },
    nftId: {
        type: String
    },
    seller: {
        type: String
    },
    bidPrice: {
        type: Number
    },
    tokenName: {
        type: String
    },
    tokenAddr: {
        type: String
    },
    tokenAmount: {
        type: Number
    },
    buyer: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('Bid', BidSchema);