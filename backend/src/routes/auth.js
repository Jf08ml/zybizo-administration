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
} from "../controllers/userController";
import verifyToken from "../middleware/auth.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/refreshtokens", refreshTokens);
router.get("/getuser", verifyToken, getUser);
router.put("/updateuser", verifyToken, updateUser);
router.put("/updatepassword", verifyToken, updatePassword);
router.get("/userrole", verifyToken, userRole);

export default router;
