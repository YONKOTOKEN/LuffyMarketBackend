var Mongoose = require("mongoose");

const { Schema } = Mongoose;

const FolderSchema = Schema({
    img: {
        type: String
    },
    userImg: {
        type: String
    },
    title: {
        type: String
    },
    username: {
        type: String
    },
    wallet: {
        type: String
    },
    category: {
        type: String
    },
    burn: {
        type: Boolean,
        default: false
    },
    itemCount: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('Folder', FolderSchema);