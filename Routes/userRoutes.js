const express = require("express");
const { signup, signin, visitorPublicIp } = require("../Controllers/userController");

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/publicIp/", visitorPublicIp);

module.exports = router;