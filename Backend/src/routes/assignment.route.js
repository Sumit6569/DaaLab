import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyJWT2 } from "../middlewares/auth.teacher.middleware.js";
import {
  createAssignment,
  deleteAssignment,
  deletework,
  getAssignmentDetails,
  getSectionDetails,
  getWorkDetails,
  submitWork,
} from "../controllers/assignment.controller.js";
import { getActivityDetails } from "../controllers/activity.controller.js";

const router = Router();

router.route("/createAssignment").post(upload.fields([{ name: "avatar", maxCount: 1 }]), createAssignment);

router.route("/sectionDetails").get(getSectionDetails);

router.route("/assignmentDetails").get(getAssignmentDetails);

router.route("/studentWorkDetails").get(getWorkDetails);

router.route("/submitWork").post(verifyJWT, upload.fields([{ name: "avatar", maxCount: 1 }]), submitWork);

router.route("/deleteWork").post(deletework);

router.route("/deleteAssignment").post(verifyJWT2, deleteAssignment);

//  Activity router
router.route("/getActivityDetails").get(getActivityDetails)

export default router;
