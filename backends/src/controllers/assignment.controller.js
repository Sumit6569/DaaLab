import { Assignment } from "../models/assignment.model.js";
import { Section } from "../models/section.model.js";
import { Student } from "../models/student.model.js";
import { StudentWork } from "../models/studentWork.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js";
import { logActivity } from "./activity.controller.js";

const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate, sectionName } = req.body;

  const teacher = await Teacher.findOne().select("-password -email");

  console.log(title, description, dueDate, sectionName);

  if ([title, description, dueDate].some((field) => field?.trim() === "")) {
  await logActivity(`New Assignment Created: ${teacher.fullName}`, teacher._id, "Data missing",  "Failed");

    throw new ApiError(400, "All fields are required");
  }

  if (!sectionName) {
  await logActivity(`New Assignment Created: ${teacher.fullName}`, teacher._id, "Section names required",  "Failed");

    throw new ApiError(400, "Section fields are required");
  }

  // Find sections by their names
  const sections = await Section.find({ name: { $in: sectionName } });

  if (sections.length === 0) {
    throw new ApiError(404, "No sections found with the given names");
  }
  

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
  await logActivity(`New Assignment Created: ${teacher.fullName}`, teacher._id, "Image are required",  "Failed");

    throw new ApiError(400, "Image file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
 

  if (!avatar) {
  await logActivity(`New Assignment Created: ${teacher.fullName}`, teacher._id, "Image are required",  "Failed");

    throw new ApiError(400, "Image file is required");
  }

  const assignment = await Assignment.create({
    title,
    description,
    dueDate,
    sectionId: sections.map((section) => section._id),
    avatar: avatar.url,
    teacher: teacher._id,
  });

  const assignmentCrated = await assignment.save();

  if (!assignmentCrated) {
  await logActivity(`New Assignment Created: ${teacher.fullName}`, teacher._id, "Server error",  "Failed");

    throw new ApiError( 500, "Something went wrong while creating new assignment" );
  }

  for (let section of sections) {
    if (!section.assignments.includes(assignmentCrated._id)) {
      section.assignments.push(assignmentCrated._id);
      await section.save(); // Save the section after adding the assignment
    }
  }
  await logActivity(`New Assignment Created: ${teacher.fullName}`, teacher._id, "Nothing",  "Completed");

  return res
    .status(200)
    .json(
      new ApiResponse( 200, assignmentCrated, "New Assignment Created successfully")
    );
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.body;

  console.log(assignmentId);
  

  const teacher = await Teacher.findOne().select("-password -email");

  const assignment = await Assignment.findById(assignmentId);

  console.log(assignmentId, assignment);

  if (!assignment) {
  await logActivity(`Assignment Delete: ${teacher.fullName}`, teacher._id, "Assignment not found",  "Failed");

    throw new Error("Assignment not found");
  }

  // Check if the current user (teacher) is the owner of the assignment
  if (assignment.teacher.toString() != teacher._id) {
  await logActivity(`Assignment Delete: ${teacher.fullName}`, teacher._id, "You are not admin",  "Failed");

    throw new Error("You are not authorized to delete this assignment");
  }

  // const avatarLocalPath = req.file?.path

  const currentAvatarUrl = assignment.avatar;

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
  await logActivity(`Assignment Delete: ${teacher.fullName}`, teacher._id, "Image deletion faild",  "Failed");

    throw new ApiError(500, "Error deleting old assignment");
  }

  // Find all sections containing this assignment and remove the assignment ID from their arrays
  await Section.updateMany(
    { assignments: assignment._id },
    { $pull: { assignments: assignment._id } }
  );

  const AssignmentDelete = await Assignment.findByIdAndDelete(assignment._id);

  if (!AssignmentDelete) {
  await logActivity(`Assignment Delete: ${teacher.fullName}`, teacher._id, "Server error",  "Failed");

    throw new ApiError(400, "error while deleting assignment");
  }
  await logActivity(`Assignment Delete: ${teacher.fullName}`, teacher._id, "Nothing",  "Completed");

  return res
    .status(200)
    .json(
      new ApiResponse(200, AssignmentDelete, "Assignment delete successfull")
    );
});

const submitWork = asyncHandler(async (req, res) => {
  const { assignmentId } = req.body;

  const student = await Student.findById(req.student?._id);

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {

    await logActivity(`Work Submit: ${student.fullName}`, student._id, "Assignment not found",  "Failed");
    return res.status(404).json({ message: "Assignment not found" });
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    await logActivity(`Work Submit: ${student.fullName}`, student._id, "Image are required",  "Failed");

    throw new ApiError(400, "Image file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    await logActivity(`Work Submit: ${student.fullName}`, student._id, "Image are required",  "Failed");

    throw new ApiError(400, "Image file is required");
  }

  const submit = await StudentWork.create({
    avatar: avatar.url, // Upload file
    students: student._id, //reference to student
    assignments: assignment._id, // reference to assignment
  });

  const submitWorks = await submit.save();
  console.log(submitWorks._id)
  assignment.studentWorkId = submitWorks._id
  await assignment.save();

  if (!submitWorks) {
    await logActivity(`Work Submit: ${student.fullName}`, student._id, "Server error",  "Failed");

    throw new ApiError(
      500,
      "Something went wrong while creating new assignment"
    );
  }
  await logActivity(`Work Submit: ${student.fullName}`, student._id, "Nothing",  "Completed");

  return res
    .status(200)
    .json(new ApiResponse(200, submitWorks, "Assignment submit successfully"));
});

const deletework = asyncHandler(async (req, res) => {
  const { workId } = req.body;

  const student = await Student.findOne().select("-password -email");

  const studentWork = await StudentWork.findById(workId);

  if (!studentWork) {
    throw new Error("Student work not found");
  }

  // Check if the current user (teacher) is the owner of the assignment
  if (studentWork.students.toString() != student._id) {
    await logActivity(`Work Delete: ${student.fullName}`, student._id, "Server error",  "Failed");

    throw new Error("You are not authorized to delete this assignment");
  }

  const currentAvatarUrl = studentWork.avatar;

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
    await logActivity(`Work Delete: ${student.fullName}`, student._id, "image not delete",  "Failed");

    throw new ApiError(500, "Error deleting old work");
  }

  // Find Assignment containing submiWwork and remove the work ID
  await Assignment.updateOne(
    { studentWorkId: studentWork._id },
    { $pull: { studentWorkId: studentWork._id } }
  );

  const deleteWork = await StudentWork.findByIdAndDelete(studentWork._id);

  if (!deleteWork) {
    await logActivity(`Work Delete: ${student.fullName}`, student._id, "Server error",  "Failed");

    throw new ApiError(400, "error while deleting assignment");
  }
  await logActivity(`Work Delete: ${student.fullName}`, student._id, "Nothing",  "Completed");

  return res
    .status(200)
    .json(new ApiResponse(200, deleteWork, "submit work delete successfull"));
});

const getAssignmentDetails = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find().populate("sectionId");

  if (!assignments || assignments.length === 0) {
    return res.status(404).json(new ApiError(404, "No Assignment found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, assignments, "Current Assignment data sent successfully")
    );
});

const getSectionDetails = asyncHandler(async (req, res) => {
  const sections = await Section.find().populate('students');

  if (!sections || sections.length === 0) {
    return res.status(404).json(new ApiError(404, "No sections found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, sections, "Current Section data sent successfully")
    );
});

const getWorkDetails = asyncHandler(async (req, res) => {
  const studentWork = await StudentWork.find().populate("assignments");

  if (!studentWork || studentWork.length === 0) {
    return res.status(404).json(new ApiError(404, "No Work found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, studentWork, "All student work sent successfully")
    );
});


export {
  createAssignment,
  deleteAssignment,
  submitWork,
  deletework,
  getSectionDetails,
  getAssignmentDetails,
  getWorkDetails
};
