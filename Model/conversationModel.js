const mongoose = require("mongoose");

const conversation = new mongoose.Schema(
    {
        consulationId: String,
        userId: String,
        conversationTitle: String

    },
    {
        timestamps: true,
    }
);

const conversationModel = mongoose.model("Conversation", conversation);

module.exports = conversationModel; 