import Reward from "../models/rewards.js";

class RewardService {
  async createReward(data) {
    try {
      const newReward = new Reward(data);
      return await newReward.save();
    } catch (error) {
      throw error;
    }
  }

  async getReward() {
    try {
      return await Reward.find({});
    } catch (error) {
      throw error;
    }
  }

  async updateReward(RewardId, updateData) {
    try {
      return await Reward.findByIdAndUpdate(RewardId, updateData, {
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteReward(RewardId) {
    try {
      return await Reward.findByIdAndDelete(RewardId);
    } catch (error) {
      throw error;
    }
  }
}

export default new RewardService();
