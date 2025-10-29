import { Router } from "express";
const router = Router();
import {
  signup,
  login,
  refreshTokens,
  getUser,
  updateUser,
  updatePassword,
  userRole,
} from "../controllers/userController.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/refreshtokens", refreshTokens);
router.get("/getuser", getUser);
router.put("/updateuser", updateUser);
router.put("/updatepassword", updatePassword);
router.get("/userrole", userRole);

export default router;
