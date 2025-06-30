import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  area: { type: String, required: true },
  subArea: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
});

export default mongoose.model("User", UserSchema);