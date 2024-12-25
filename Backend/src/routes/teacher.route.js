import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT2 } from "../middlewares/auth.teacher.middleware.js";
import {
  changeCurrentPassword,
  deleteTeacher,
  getCurrentTeacher,
  getTeacherDetails,
  loginAdmin,
  loginTeacher,
  logoutTeacher,
  refreshAccessToken,
  registerTeacher,
} from "../controllers/teacher.controller.js";

const router = Router();

router.route("/register").post(upload.fields([ { name: "avatar", maxCount: 1}]), registerTeacher);
// router.route("/register").post(upload.none(), registerTeacher);

router.route("/login").post(loginTeacher);

router.route("/adminlogin").post(loginAdmin);

router.route("/forgetPassword").post(verifyJWT2, changeCurrentPassword);

router.route("/getTeacher").get(verifyJWT2, getCurrentTeacher);

router.route("/getTeacherDetails").get(getTeacherDetails);

router.route("/deleteTeacher").post(verifyJWT2, deleteTeacher);

// router.route("/updateAccount").patch(verifyJWT, updateAccountDetails)

// secure routers
router.route("/logout").post(verifyJWT2, logoutTeacher);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
