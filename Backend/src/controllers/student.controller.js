import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Student } from "../models/student.model.js";
import { Section } from "../models/section.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/teacher.model.js";
import { StudentWork } from "../models/studentWork.js";
import { logActivity } from "./activity.controller.js";

const generateAccessAndRefreshTokens = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    console.log("token generated");

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(
      500,
      "Something went wrong in generating refresh and access tokens"
    );
  }
};

const googleAuth = asyncHandler(async (req, res) => {
  console.log("Received request for Google auth");
  console.log("Request body:", req.body);

  const { accessToken, refreshToken } = req.body;

  if (!accessToken || !refreshToken) {
    console.log("Missing tokens");
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Tokens are required"));
  }

  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const student = await Student.findById(decodedAccessToken._id);

    if (!student) {
      console.log("student not found");
      return res
        .status(401)
        .json(new ApiResponse(401, null, "student not found"));
    }

    console.log("Stored Refresh Token:", student.refreshToken);

    if (student.refreshToken !== refreshToken) {
      console.log("Invalid refresh token");
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid refresh token"));
    }

    const newAccessToken = student.generateAccessToken();
    const newRefreshToken = student.generateRefreshToken();

    student.refreshToken = newRefreshToken;
    await student.save();

    console.log("student authenticated successfully");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            student,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json(new ApiResponse(401, null, "Invalid tokens"));
  }
});

const registerStudent = asyncHandler(async (req, res) => {
  const { fullName, email, password, conformPassword, branch, sectionName } =
    req.body;

  console.log(fullName, email, password, conformPassword, branch, sectionName);

  if (
    [fullName, email, password, conformPassword, branch, sectionName].some(
      (field) => field?.trim() === ""
    )
  ) {
    await logActivity(`Student Register: ${fullName}`, "N/A", "Missing data",  "Failed");
    
    throw new ApiError(400, "All fields are required");
  }

  // Validate email to allow only college email IDs
  const emailDomain = "@jietjodhpur.ac.in";
  if (!email.endsWith(emailDomain)) {
    await logActivity(`Student Register: ${fullName}`, "N/A", "Not college email",  "Failed");
    throw new ApiError(400, `Only college email IDs are allowed`);
  }

  const existedStudent = await Student.findOne({ email });

  if (existedStudent) {
    await logActivity(`Student Register: ${fullName}`, "N/A", "Same email exist",  "Failed");
    throw new ApiError(409, "User with email already exists");
  }

  let section = await Section.findOne({ name: sectionName });

  if (!section) {
    section = await Section.create({ name: sectionName });
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    await logActivity(`Student Register: ${fullName}`, "N/A", "Image missing",  "Failed");
    throw new ApiError(400, "Image file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    await logActivity(`Student Register: ${fullName}`, "N/A", "Image missing",  "Failed");
    throw new ApiError(400, "Image file is required");
  }

  if (!(password === conformPassword)) {
    await logActivity(`Student Register: ${fullName}`, "N/A", "Password not same",  "Failed");
    throw new ApiError(400, "Password and Confirm password do not match");
  }

  const student = await Student.create({
    fullName,
    email,
    password,
    branch,
    sectionId: section._id,
    avatar: avatar.url,
    provider: "student",
  });

  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  section.students.push(student._id);
  await section.save();

  if (!createdStudent) {
    throw new ApiError( 500, "Something went wrong while registering the student");
  }

  await logActivity(`Student Register: ${student.fullName}`, student._id, "Nothing",  "Completed");

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdStudent, "Student registered successfully")
    );
});

const logoutStudent = asyncHandler(async (req, res) => {
  Student.findByIdAndUpdate(
    req.student._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Student logout Successfully"));
});

async function loginStudent(req, res) {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: "student not found" });
    }

    const isPasswordValid = await student.isPasswordCorrect(password);

    if (!isPasswordValid) {
    await logActivity(`Student Login: ${student.fullName}`, student._id, "Password not match",  "Failed");

      return res.status(400).json({ message: "Invalid password" });
    }

    const tokens = await generateAccessAndRefreshTokens(student._id);

    // Send tokens in the response
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true, // to prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await logActivity(`Student Login: ${student.fullName}`, student._id, "Nothing",  "Completed");

    res.json({ student, tokens });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorize request");
  }
  // decode token
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const student = await Student.findById(decodedToken?._id);

    if (!student) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== student?.refreshToken) {
      throw new ApiError(401, "Refresh token is expire or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(student._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, conformPassword } = req.body;

  if (!(newPassword === conformPassword)) {
    throw new ApiError(400, "Conform password not match");
  }
  // req.id from auth.middleware
  const student = await Student.findById(req.student?._id);

  // check passward student.mode -- custome domain
  const isPasswordCorrect = await student.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "old password not match");
  }

  student.password = newPassword;

  await student.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, student, "Password changed successfull"));
});

const getCurrentStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.student.id);
  return res
    .status(200)
    .json(
      new ApiResponse(200, student, "current student fetched successfully")
    );
});

const getStudentDetails = asyncHandler(async (req, res) => {
  const student = await Student.find().populate();

  if (!student) {
    return res.status(404).json(new ApiError(404, "student not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, student, "Current student data sent successfully")
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { branch, email } = req.body;

  if (!branch || !email) {
    throw new ApiError(400, "required email or branch");
  }

  const student = await Student.findByIdAndUpdate(
    req.student?._id,
    {
      $set: {
        branch: branch,
        email: email,
      },
    },
    { new: true }
  ).select("-password"); // password not update

  return res
    .status(200)
    .json(
      new ApiResponse(200, student, "phoneNumber or email updated successfull")
    );
});

const getStudentProgress = async (req, res) => {
  try {
    console.log("student : ", req.student?._id);
    const student = await Student.findById(req.student?._id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const completedTasks = student.tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const totalTasks = student.tasks.length;
    const progress = (completedTasks / totalTasks) * 100;

    res.json({ progress, tasks: student.tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    throw new Error("Student Id are required");
  }

  // Verify the request is made by an admin
  const teacherId = req.teacher?._id; // Extract admin ID from the authenticated user
  const teacher = await Teacher.findById(teacherId);

  if (!teacher || teacher.provider !== "admin") {
  await logActivity(`Student Delete: ${student.fullName}`, student._id, "Only admin can delete",  "Failed");

    throw new Error("Only admins are authorized to delete students");
  }

  // Find the student
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  console.log("Student to delete:", studentId, student.avatar);

  // Delete the student's avatar from Cloudinary
  const currentAvatarUrl = student.avatar;

  // Extract publicId from URL
  const publicIdMatch = currentAvatarUrl.match(
    /\/v\d+\/([^\/]+)\.[a-z]{3,4}$/i
  );
  if (!publicIdMatch) {
    throw new ApiError(400, "Invalid avatar URL format");
  }

  const publicId = publicIdMatch[1];
  console.log("delete ", publicId);
  const deletionSuccessful = await deleteFromCloudinary(publicId);

  if (!deletionSuccessful) {
    throw new ApiError(500, "Error deleting old assignment");
  }

  // Remove the student from all sections
  await Section.updateMany(
    { students: student._id },
    { $pull: { students: student._id } }
  );

  // Fetch and delete all StudentWork avatars
  const studentWorks = await StudentWork.find({ students: student._id });

  for (const work of studentWorks) {

    const workAvatarUrl = work.avatar;
    const avatarMatch = workAvatarUrl.match(/\/v\d+\/([^\/]+)\.[a-z]{3,4}$/i);

    if (avatarMatch) {

      const workAvatarId = avatarMatch[1];
      const workDeletionSuccess = await deleteFromCloudinary(workAvatarId);

      if (!workDeletionSuccess) {
        console.warn(`Failed to delete avatar for StudentWork ID: ${work._id}`);
      }
    }
  }

  // Delete all related StudentWork entries
  const studentWorkDeletion = await StudentWork.deleteMany({
    students: student._id,
  });

  console.log(`${studentWorkDeletion.deletedCount} StudentWork entries deleted`);

  // Delete the student
  const StudentDelete = await Student.findByIdAndDelete(student._id);
  if (!StudentDelete) {
  await logActivity(`Student Delete: ${student.fullName}`, student._id, "Server error",  "Failed");

    throw new ApiError(400, "Error while deleting student");
  }
  await logActivity(`Student Delete: ${student.fullName}`, student._id, "Nothing",  "Completed");

  // Return the response
  return res
    .status(200)
    .json(
      new ApiResponse(200, StudentDelete, "Student and related data deleted successfully")
    );
});

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req?.params;
    const { status } = req.body;

    console.log("task : ", taskId, status);
    const student = await Student.findOne({ "tasks._id": taskId });
    if (!student) return res.status(404).json({ error: "Task not found" });

    const task = student.tasks.id(taskId);
    task.status = status;
    if (status === "completed") task.completionDate = new Date();

    await student.save();
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentStudent,
  getStudentDetails,
  updateAccountDetails,
  getStudentProgress,
  updateTaskStatus,
  deleteStudent,
  // updateUserAvatar,
  // updateUserCoverImage,
  // getUserChannelProfile,
  googleAuth,
};
