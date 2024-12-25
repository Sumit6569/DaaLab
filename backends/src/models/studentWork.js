import mongoose, { Schema } from "mongoose";

const studentWorkSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  submitedAt: {
    type: Date,
    default: Date.now,
  },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }], // Student Assignment assigned to assignment
  students: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  }, // students enrolled in the section

  status: {
    type: String,
    enum: ["not started", "in progress", "Completed"],
    default: "Completed",
  },
});

export const StudentWork = mongoose.model("StudentWork", studentWorkSchema);
