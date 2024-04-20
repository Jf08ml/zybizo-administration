import { Router } from "express";

const router = Router();

import {
  createReward,
  getRewards,
  getRewardById,
  getRewardByField,
  updateReward,
  deleteReward,
} from "../controllers/rewardController";

router.post("/rewards", createReward);
router.get("/rewards/by-field", getRewardByField);
router.get("/rewards/:id", getRewardById);
router.get("/rewards", getRewards);
router.put("/rewards/:id", updateReward);
router.delete("/rewards/:id", deleteReward);

export default router;
