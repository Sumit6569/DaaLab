import mongoose, {Schema} from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }, // Activity description
  userId: {
    type: String,
    default: "N/A"
  }, // User involved
  reason: {
    type: String,
    default: "Nothing",
  },
  status: {
    type: String,
    default: "Completed"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }, // When activity occurred
});

export const Activity = mongoose.model("Activity", activitySchema);
