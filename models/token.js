var Mongoose = require("mongoose");

const { Schema } = Mongoose;

const TokenSchema = Schema({
    tokenAddr: {
        type: String
    },
    tokenName: {
        type: String
    },
    tokenFee: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('Token', TokenSchema);