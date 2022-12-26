var Mongoose = require("mongoose");

const { Schema } = Mongoose;

const UserSchema = Schema({
    name: {
        type: String,
        default: "Unnamed"
    },
    walletAddress: {
        type: String,
        lowercase: true
    },
    avatar: {
        default: "avatar.png",
        type: String
    },
    backavatar: {
        default: "back-avatar.png",
        type: String
    },
    description: {
        type: String,
        default: "welcome"
    },
    role: {
        type: String,
        default: 'ROLE_VISITOR',
        enum: ['ROLE_VISITOR', 'ROLE_CREATOR', 'ROLE_ADMIN']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('User', UserSchema);