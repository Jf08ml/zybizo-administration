import { Router } from "express";

const router = Router();

import {
  createReward,
  getRewards,
  getRewardById,
  updateReward,
  deleteReward,
} from "../controllers/rewardController";

router.post("/rewards", createReward);
router.get("/rewards", getRewards);
router.get("/rewards/:id", getRewardById);
router.put("/rewards/:id", updateReward);
router.delete("/rewards/:id", deleteReward);

export default router;
