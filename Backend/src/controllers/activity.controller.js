import { Activity } from "../models/activity.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const logActivity = async (title, userId, reason, status) => {
    console.log(title, userId, reason, status);

    const activity = await Activity.create({
        title,  
        userId, 
        reason,
        status 
    });

    const activityCrated = await activity.save();
  
    if (!activityCrated) {
      throw new ApiError( 500, "Something went wrong while creating activity" );
    }
    return new ApiResponse( 200, activityCrated, "New Activity Created successfully")
  };

const getActivityDetails = asyncHandler(async (req, res) => {
    const activity = await Activity.find().populate();

    if (!activity || activity.length === 0) {
        return res.status(404).json(new ApiError(404, "No Activity found"));
    }

    return res
        .status(200)
        .json(
        new ApiResponse(200, activity, "Current Activity data sent successfully")
    );
});

export {
    logActivity,
    getActivityDetails,
}