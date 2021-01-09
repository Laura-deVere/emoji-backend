const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emojis: {
        type: [
            {
                _id: String,
                name: String
            }
        ],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})