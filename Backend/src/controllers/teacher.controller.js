import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Teacher } from "../models/teacher.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { logActivity } from "./activity.controller.js";

const generateAccessAndRefreshTokens = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    console.log("token generated");

    teacher.refreshToken = refreshToken;
    await teacher.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(
      500,
      "Something went wrong in generating refresh and access tokens"
    );
  }
};

const registerTeacher = asyncHandler(async (req, res) => {
  const { fullName, email, password, conformPassword, branch } = req.body;

  console.log(fullName, email, password, conformPassword, branch);

  if (
    [fullName, email, password, conformPassword].some(
      (field) => field?.trim() === ""
    )
  ) {
    await logActivity(`New Teacher Registered: ${fullName}`, "N/A", "All data required", "Failed");

    throw new ApiError(400, "All fields are required");
  }

  // Validate email to allow only college email IDs
  const emailDomain = "@jietjodhpur.ac.in";
  if (!email.endsWith(emailDomain)) {
    await logActivity(`New Teacher Registered: ${fullName}`, "N/A", "Collage email required", "Failed");

    throw new ApiError(400, `Only college email IDs are allowed`);
  }

  const existingTeacher = await Teacher.findOne({ email });

  if (existingTeacher) {
    await logActivity(`New Teacher Registered: ${fullName}`, "N/A", "Email already exist", "Failed");

    throw new ApiError(409, "Teacher with email already exists");
  }

  if (!(password === conformPassword)) {
    await logActivity(`New Teacher Registered: ${fullName}`, "N/A", "Invalid Password",  "Failed");

    throw new ApiError(400, "Password and Confirm password do not match");
  }

  const teacher = await Teacher.create({
    fullName,
    email,
    password,
    branch,
    provider: "teacher",
  });

  const createdTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );

  if (!createdTeacher) {
    await logActivity(`New Teacher Registered: ${teacher.fullName}`, "N/A", "Server error",  "Failed");

    throw new ApiError(
      500,
      "Something went wrong while registering the teacher"
    );
  }

  // Activity
  await logActivity(`New Teacher Registered: ${teacher.fullName}`, teacher._id, "Nothing",  "Completed");

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdTeacher, "Teacher registered successfully")
    );
});

const logoutTeacher = asyncHandler(async (req, res) => {
  Teacher.findByIdAndUpdate(
    req.teacher._id,
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
    .json(new ApiResponse(200, {}, "User logout Successfully"));
});

async function loginTeacher(req, res) {
  const { email, password } = req.body;
  console.log("email : ", email, password);
  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(400).json({ message: "teacher not found" });
    }

    const isPasswordValid = await teacher.isPasswordCorrect(password);

    if (!isPasswordValid) {
      await logActivity(`Teacher Login: ${teacher.fullName}`, teacher._id, "Password not match", "Failed");
      return res.status(400).json({ message: "Invalid password" });
    }

    const tokens = await generateAccessAndRefreshTokens(teacher._id);

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

    await logActivity(`Teacher Login: ${teacher.fullName}`, teacher._id, "Nothing",
       "Completed");

    res.json({ teacher, tokens });
  } catch (error) {
    await logActivity(`Teacher Login`, "N/A", "server error", "Failed");
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginAdmin(req, res) {
  const { email, password } = req.body;
  console.log("email : ", email, password);
  try {
    const teacher = await Teacher.findOne({ email });

    const provider = teacher.provider;

    if (!teacher) {
      await logActivity(`Admin Login: ${teacher.fullName}`, "N/A", "Admin not found", "Failed");

      return res.status(400).json({ message: "teacher not found" });
    }

    if (!(provider === "admin")) {
      console.log("not matching");
      await logActivity(`Admin Login: ${teacher.fullName}`, "N/A", "Not admin email", "Failed");
      return res.status(400).json({ message: "Login with admin Account" });
    }

    const isPasswordValid = await teacher.isPasswordCorrect(password);

    if (!isPasswordValid) {
      await logActivity(`Admin Login: ${teacher.fullName}`, "N/A", "Password not match", "Failed");

      return res.status(400).json({ message: "Invalid password" });
    }

    const tokens = await generateAccessAndRefreshTokens(teacher._id);

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

    res.json({ teacher, tokens });

  await logActivity(`Admin Login: ${teacher.fullName}`, teacher._id, "Nothing", "Completed");

  } catch (error) {
    console.error("Login error:", error.message);
    await logActivity(`Admin Login`, "N/A",  "Failed");
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

    const teacher = await Teacher.findById(decodedToken?._id);

    if (!teacher) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== teacher?.refreshToken) {
      throw new ApiError(401, "Refresh token is expire or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(teacher._id);

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

  console.log(oldPassword, newPassword, conformPassword);
  if (!(newPassword === conformPassword)) {
    throw new ApiError(400, "Conform password not match");
  }
  // req.id from auth.middleware
  const teacher = await Teacher.findById(req.teacher?._id);

  // check passward teacher.mode -- custome domain
  const isPasswordCorrect = await teacher.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "old password not match");
  }

  teacher.password = newPassword;

  await teacher.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, teacher, "Password changed successfull"));
});

const getCurrentTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.teacher.id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, teacher, "current teacher fetched successfully")
    );
});

const getTeacherDetails = asyncHandler(async (req, res) => {
  const teacher = await Teacher.find().populate();

  if (!teacher) {
    return res.status(404).json(new ApiError(404, "teacher not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, teacher, "Current teacher data sent successfully")
    );
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;

  if (!teacherId) {
    throw new Error("Teacher Id are required");
  }

  // Verify the request is made by an admin
  const adminId = req.teacher?._id; // Extract admin ID from the authenticated user
  const admin = await Teacher.findById(adminId);

  // Find the Teacher
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    await logActivity(`Teacher Delete: ${teacher.fullName}`, "N/A", "Teacher not found", "Failed");
    throw new Error("Teacher not found");
  }

  if (!admin || admin.provider !== "admin") {
    await logActivity(`Teacher Delete: ${teacher.fullName}`, "N/A", "You are not admin", "Failed");
    throw new Error("Only admins are authorized to delete students");
  }

  // Delete the teacher
  const TeacherDelete = await Teacher.findByIdAndDelete(teacher._id);
  if (!TeacherDelete) {
    throw new ApiError(400, "Error while deleting student");
  }

  await logActivity(`Teacher Deleted: ${teacher.fullName}`, teacher._id, "Nothing", "Completed");
  // Return the response
  return res
    .status(200)
    .json(
      new ApiResponse(200, TeacherDelete, "Teacher and related data deleted successfully")
    );
});

export {
  registerTeacher,
  loginTeacher,
  loginAdmin,
  logoutTeacher,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentTeacher,
  getTeacherDetails,
  deleteTeacher,

};
