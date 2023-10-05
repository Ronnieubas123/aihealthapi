const mongoose = require("mongoose");

const patientForm = new mongoose.Schema(
    {
        consultationId: String,
        patientInfo: [{
            patientName: String,
            age: Number,
            height: String,
            gender: String,
            weight: String,
            currentCondition: String,
            surgery: String,
            symptoms: String,
            allergies: String,
            medications: String,
            hereditary: String,
            temperature: String,
            respiratoryRate: String,
            waistline: String,
            heartRate: String,
            oxygenSaturation: String,
            hipLine: String,
            diastolicBp: String,
            albumin: String,
            ast: String,
            calcium: String,
            glucose: String,
            potassium: String,
            triglycerides: String,
            hdl: String,
            alt: String,
            bun: String,
            creatinine: String,
            hba1c: String,
            sodium: String,
            ldl: String,
            egfr: String
        }],
        userId: String,

    },
    {
        timestamps: true,
    }
);

const patientFormModel = mongoose.model("PatientForm", patientForm);

module.exports = patientFormModel; 