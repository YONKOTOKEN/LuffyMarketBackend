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
    art: {
        type: Boolean,
        default: false
    },
    collect: {
        type: Boolean,
        default: false
    },
    domain: {
        type: Boolean,
        default: false
    },
    music: {
        type: Boolean,
        default: false
    },
    photo: {
        type: Boolean,
        default: false
    },
    burn: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('Folder', FolderSchema);