import Reward from "../models/rewards.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class RewardService {
  async createReward(data) {
    try {
      const { phoneNumber, usernameInsta } = data;

      const phoneExists = await Reward.findOne({ phoneNumber });
      if (phoneExists) {
        throw new ValidationError("El número de teléfono ya está registrado.");
      }
      const usernameExists = await Reward.findOne({ usernameInsta });
      if (usernameExists) {
        throw new ValidationError(
          "El nombre de usuario de Instagram ya está registrado."
        );
      }
      const newReward = new Reward(data);
      return await newReward.save();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError("Error al crear la recompensa.");
    }
  }

  async getRewards() {
    try {
      const rewards = await Reward.find();
      return rewards;
    } catch (error) {
      throw new DatabaseError("Error al obtener las recompensas.");
    }
  }

  async getReward(id) {
    try {
      const reward = await Reward.findById(id);
      if (!reward) {
        throw new NotFoundError("Recompensa no encontrada.");
      }
      return reward;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al obtener la recompensa.");
    }
  }

  async getRewardByField(searchParams) {
    try {
      const rewards = await Reward.findOne(searchParams);
      if (rewards.length === 0) {
        throw new NotFoundError(
          "No se encontraron recompensas con los criterios especificados."
        );
      }
      return rewards;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al buscar las recompensas.");
    }
  }

  async updateReward(rewardId, updateData) {
    try {
      const updatedReward = await Reward.findByIdAndUpdate(
        rewardId,
        updateData,
        { new: true }
      );
      if (!updatedReward) {
        throw new NotFoundError("Recompensa no encontrada para actualizar.");
      }
      return updatedReward;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al actualizar la recompensa.");
    }
  }

  async deleteReward(rewardId) {
    try {
      const deletedReward = await Reward.findByIdAndDelete(rewardId);
      if (!deletedReward) {
        throw new NotFoundError("Recompensa no encontrada para eliminar.");
      }
      return deletedReward;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al eliminar la recompensa.");
    }
  }
}

export default new RewardService();
