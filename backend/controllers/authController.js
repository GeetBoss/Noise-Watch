import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";

// In-memory OTP storage
const otpStore = new Map();

// REGISTER
export const register = async (req, res) => {
  const { email, username, password, area, subArea } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      area,
      subArea,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// LOGIN STEP 1
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Credentials valid", email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// SEND OTP (FIXED VERSION)
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  // OTP generation
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();

  console.log("📨 Sending OTP to:", email);
  console.log("Generated OTP:", otp);

  const otpData = {
    otp,
    expires: Date.now() + 10 * 60 * 1000,  // OTP expiration time (10 minutes)
  };

  otpStore.set(email, otpData);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "prajapatigeet14@gmail.com",
      pass: "eqco mgui onpm owcx",
    },
  });

  const mailOptions = {
    from: '"NoiseWatch" <prajapatigeet14@gmail.com>',
    to: email,
    subject: "Your OTP for NoiseWatch",
    html: `<p>Your OTP is: <b>${otp}</b></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent!");
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};


// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore.get(email);
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  otpStore.delete(email); // remove after use

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    message: "OTP verified successfully",
    user: {
      username: user.username,
      name: user.username,
      area: user.area,
      subArea: user.subArea,
    },
  });
};

// GOOGLE AUTH
export const googleAuth = async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        username: name,
        password: "GOOGLE_AUTH",
        area: "Not Provided",
        subArea: "Not Provided",
      });
      await user.save();
    }

    res.status(200).json({
      message: "Google Auth successful",
      user: {
        username: user.username,
        name: user.username,
        area: user.area,
        subArea: user.subArea,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Google Auth failed", error: err.message });
  }
};
