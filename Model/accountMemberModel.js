const mongoose = require("mongoose");

const accountMemberSchema = new mongoose.Schema(
    {
        userId: String,
        name : String
    },
    {
        timestamps: true
    }
);

const accountMemberModel = mongoose.model("Member", accountMemberSchema);

module.exports = accountMemberModel;