import mongoose, { Schema } from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  visibility: {
    type: String,
    enum: ["published", "scheduled"],
    default: "published",
  },
  studentWorkId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentWork",
    },
  ],
  sectionId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ], // Array of section references
  status: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started",
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});

export const Assignment = mongoose.model("Assignment", assignmentSchema);
