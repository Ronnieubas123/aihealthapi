const express = require("express");
const { consulation, history, viewhistory, patientForm, accountMember, accountMembersList } = require("../Controllers/chatbotController");

const router = express.Router();

router.post("/consulation", consulation);
router.post("/history/:currentUserId", history);
router.get("/viewhistory/:viewChatHistory", viewhistory)
router.post("/patientForm/", patientForm);
router.post("/accountmember/", accountMember);
router.get("/accountmemberslist/:userId", accountMembersList);



module.exports = router;