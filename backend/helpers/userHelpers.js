const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

const hashPassword = async (password) => {
    try {
        const saltRound = 10;
        const hashPass = await bcrypt.hash(password, saltRound);
        return hashPass;
    } catch (error) {
        console.log("error in hashing password", error);
        throw error;
    }
}

const comparePassword = async (password, hashPassword) => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        console.log("error while comparing password", error);
        throw error;
    }
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
};

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        to: email,
        subject: 'Your OTP for Password Reset',
        html: `<p>Your OTP for password reset is <strong>${otp}</strong>. This OTP is valid for 10 minutes.</p>`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { hashPassword, comparePassword, generateOTP, sendOTPEmail}
