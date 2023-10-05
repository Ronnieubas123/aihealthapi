const registrationModel = require("../Model/registrationModel");
const ipModel = require("../Model/visitorIpModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;

    return jwt.sign({_id}, jwtkey);
}

const signup = async (req, res) => {

  try {
        const { name, email, password } = req.body;

        let user = await registrationModel.findOne({email});

        if (user) return res.status(400).json("Email is already exist");

        if (!email || !password || !name) return res.status(400).json("All fields are required");

        if (!validator.isEmail(email)) return res.status(400).json("Email must be valid email");

        if (!validator.isStrongPassword(password)) return res.status(400).json("Password is not Strong");

        let ip = await fetch('https://api.ipify.org?format=json')
            .then(x => x.json())
            .then(({ ip }) => {
                return ip;
        });

        let limit = 1000;
        let creditLimitUse = 0;

        user = new registrationModel( {name, email, password, ip, limit, creditLimitUse });

        const randomCharacter = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(user.password, randomCharacter);
        
        await user.save();

        const token = createToken(user._id);

        res.status(200).json({_id: user._id, name, email, token, limit});

    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await registrationModel.findOne({email});

        if (!user) return res.status(400).json("Invalid email or password");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);

        res.status(200).json({_id: user._id, name: user.name, email: email, token: token, limit: user.limit});
    } catch (error) {

    }
}

const visitorPublicIp = async (req, res) => {

    try {
        // get public ip
        let ip = await fetch('https://api.ipify.org?format=json')
            .then(x => x.json())
            .then(({ ip }) => {
                return ip;
            
        });

        console.log("ip:", ip);
        //find ip in database table
        let visitorIp = await ipModel.findOne({ip});

        // if IP exist no need to save
        if (visitorIp) {
            let getSignupIP = await registrationModel.findOne({ip});
            if (getSignupIP) {
                res.status(200).json(1000);
            } else {
                res.status(200).json(visitorIp.limit);
            }
        } else {
            // else setup data to save the data in ip table
            let limit = 1000;
            let creditLimitUse = 0;
            const saveIp = new ipModel({
                ip: ip,
                limit: limit,
                creditLimitUse: creditLimitUse
            });
            const response = await saveIp.save();
            res.status(200).json(response);
        }

    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
    
}

module.exports = { signup, signin, visitorPublicIp }