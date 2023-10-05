const express = require("express");
const { paymentHistory, paymentHistoryList } = require("../Controllers/paymentController");

const router = express.Router();

router.post("/history/save", paymentHistory);
router.post("/history/list", paymentHistoryList);

module.exports = router;