const { hashPassword, comparePassword, sendOTPEmail, generateOTP } = require("../helpers/userHelpers.js");
const JWT = require("jsonwebtoken");

const { User } = require("../models/user.model.js");

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.send({ error: "Name is required" });
    }

    if (!email) {
      return res.send({ error: "Email is required" });
    }

    if (!password) {
      return res.send({ error: "Password is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, 
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered.",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found.' });

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; 
      await user.save();

      await sendOTPEmail(user.email, otp);

      res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (err) {
      res.status(500).json({ message: 'Server error.' });
  }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }, 
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired OTP.' });

        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

const setNewPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.password = await hashPassword(password); 
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};


module.exports = {registerController, loginController, requestPasswordReset,verifyOTP,setNewPassword };