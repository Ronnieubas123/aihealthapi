// "test": "echo \"Error: no test specified\" && exit 1"

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//Routes
const chatbotRoutes = require("./Routes/chatbotRoutes");
const userRoutes = require("./Routes/userRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to our AI HEALTH PROS");
});

const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedToPology: true,
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("MonggoDB connetion success"))
    .catch((error) => console.log("MongoDB connection failed", error.message));
