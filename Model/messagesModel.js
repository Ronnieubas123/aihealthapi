const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        consulationId: String,
        userId: String,
        role: String,
        content: String,
        completioToken: Number
    },
    {
        timestamps: true
    }
);

const messagesModel = mongoose.model("Messages", messageSchema);

module.exports = messagesModel;