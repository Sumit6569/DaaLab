import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const teacherSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },

    refreshToken: {
      type: String,
    },

    provider: {
      type: String,
      default: "teacher",
    },
    image: {
      url: String,
      filename: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    Token: {
      type: String,
    },
  },
  { timestamps: true }
);

// Assuming this is a part of your teacherSchema
teacherSchema.pre("save", async function (next) {
  if (this.provider === "google" || !this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    return next(err);
  }
  next();
});

teacherSchema.methods.isPasswordCorrect = async function (password) {
  console.log("Stored password:", this.password);
  console.log("Provided password:", password);
  return await bcrypt.compare(password, this.password);
};

// In your user.model.js or wherever you define these functions
teacherSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" } // Default to '15m'
  );
};

teacherSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" } // Default to '7d'
  );
};

export const Teacher = mongoose.model("Teacher", teacherSchema);
