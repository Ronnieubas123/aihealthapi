const mongoose = require("mongoose"); 

const registrationSchema = new mongoose.Schema( 
    {
        name: {
            type: String, 
            require: true
        },
        email: {
            type: String, 
            required: true,
            minlegth: 3,
            maxlength: 200,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlegth: 3,
            maxlength: 1024
        },
        ip: String,
        limit: Number,
        creditLimitUse: Number

    }, 
    {
        timestamps: true
    }
);

const registrationModel = mongoose.model("Registration", registrationSchema);
module.exports = registrationModel;