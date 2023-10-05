const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        userId: String,
        checkoutSessionId: String,
        purchasedPlan: String,
        purchasedCredits: Number,
        purchasedAmount: Number
    },
    {
        timestamps: true
    }
);

const paymentModel = mongoose.model("Payments", paymentSchema);

module.exports = paymentModel;