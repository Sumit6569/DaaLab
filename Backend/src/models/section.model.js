import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ], // students enrolled in the section
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }], // assignments assigned to this section
});

export const Section = mongoose.model("Section", sectionSchema);
