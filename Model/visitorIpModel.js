const mongoose = require("mongoose");

const ipSchema = new mongoose.Schema(
    {
        id: String,
        ip: String,
        limit: Number,
        creditLimitUse: Number
    },
    {
        timestamps: true
    }
);

const ipModel = mongoose.model("Ip", ipSchema);

module.exports = ipModel;