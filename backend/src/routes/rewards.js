import { Router } from "express";

const router = Router();

import {
  createReward,
  getAllRewards,
  getRewardById,
  updateReward,
  deleteReward,
} from "../controllers/rewardController";

router.post("/rewards", createReward);
router.get("/rewards", getAllRewards);
router.get("/rewards/:id", getRewardById);
router.put("/rewards/:id", updateReward);
router.delete("/rewards/:id", deleteReward);

export default router;
