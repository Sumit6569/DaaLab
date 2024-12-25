import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentStudent,
  logoutStudent,
  refreshAccessToken,
  registerStudent,
  updateAccountDetails,
  googleAuth,
  loginStudent,
  getStudentDetails,
  getStudentProgress,
  updateTaskStatus,
  deleteStudent,
} from "../controllers/student.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import passport from "../utils/passport.js";
import { verifyJWT2 } from "../middlewares/auth.teacher.middleware.js";
const router = Router();

router.route("/register").post(upload.fields([ { name: "avatar", maxCount: 1}]), registerStudent);

router.route("/login").post(loginStudent);

router.route("/forgetPassword").post(verifyJWT, changeCurrentPassword);

router.route("/getStudent").get(verifyJWT, getCurrentStudent);

router.route("/getStudentDetails").get(getStudentDetails);

router.route("/deleteStudent").post(verifyJWT2, deleteStudent)

router.route("/updateAccount").patch(verifyJWT, updateAccountDetails);

router.route("/googleLogin").post(googleAuth);

router.route("/studentProgress").get(verifyJWT, getStudentProgress);

router.route("/taskStatus:taskId").patch(verifyJWT, updateTaskStatus);

// secure routers
router.route("/logout").post(verifyJWT, logoutStudent);
router.route("/refresh-token").post(refreshAccessToken);

//Google Authenticaton Routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CORES_ORIGIN}/login`,
  }),
  async (req, res) => {
    const student = req.student;
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save();

    res.redirect(
      `${process.env.CORES_ORIGIN}/google-login?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

export default router;
