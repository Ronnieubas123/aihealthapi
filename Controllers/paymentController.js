const paymentModel = require("../Model/paymentModel");
const registrationModel = require("../Model/registrationModel");
const date = require('date-and-time');

const paymentHistory = async (req, res) => {
    const {userId, checkoutSessionId, purchasedPlan, purchasedCredits, purchasedAmount} = req.body;

    try {
        const payment = new paymentModel({
            userId: userId, 
            checkoutSessionId: checkoutSessionId,
            purchasedPlan: purchasedPlan,
            purchasedCredits: purchasedCredits,
            purchasedAmount: purchasedAmount
        });

        const getUserLimit = await registrationModel.findOne({_id: userId});

        // add credit/chat limit
        const limitValue = getUserLimit.limit + purchasedCredits;

        //create new varaiable. We will use this varaiable for conditioning 
        const filter = { _id: userId };
        // create new variable. This variable is the limit value we will save this value in ip table
        const update = { limit: limitValue };
        let updateLimit = await registrationModel.findOneAndUpdate(filter, update);

        const response =  await payment.save();
        res.status(200).json(limitValue); 
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const paymentHistoryList = async (req, res) => {
    const { userId, dateFrom, dateTo } = req.body;

    const dFrom = date.format((new Date(dateFrom)),
  'YYYY-MM-DD');

    const dTo = date.format((new Date(dateTo)),
  'YYYY-MM-DD');

   const nextDay = new Date(dTo);
   nextDay.setDate(nextDay.getDate() + 1);
   const addedDate = nextDay.toISOString();

    const paymentList = await paymentModel
        .find
        ( 
            {
                userId: userId,
                createdAt: {
                    $gte: dFrom,
                    $lte: addedDate
                }
            }
        )
        .sort([["createdAt", -1]]);
        res.status(200).json(paymentList);
}

module.exports = { paymentHistory, paymentHistoryList }