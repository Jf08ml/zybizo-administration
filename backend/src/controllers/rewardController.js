import RewardService from "../services/reward.service";
import CustomErrors from "../errors/CustomErrors.js";

const { NotFoundError, ValidationError } = CustomErrors;

export const createReward = async (req, res) => {
  try {
    const newReward = await RewardService.createReward(req.body.reward);
    res.status(201).json({
      status: "success",
      data: newReward,
      message: "Recompensa guardada y disponible para reclamar, ¡escríbenos!",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const getRewards = async (req, res, next) => {
  try {
    const rewards = await RewardService.getRewards();
    res.status(200).json({
      status: "success",
      data: rewards,
      message:
        rewards.length > 0
          ? "Recompensas encontradas."
          : "No se encontraron recompensas.",
    });
  } catch (error) {
    next(error);
  }
};

export const getRewardById = async (req, res, next) => {
  try {
    const reward = await RewardService.getReward(req.params.id);
    res.status(200).json({
      status: "success",
      data: reward,
      message: "Recompensa encontrada.",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(error);
    }
    next(error);
  }
};

export const updateReward = async (req, res) => {
  try {
    const updatedReward = await RewardService.updateReward(
      req.params.id,
      req.body.reward
    );
    res.status(200).json({
      status: "success",
      data: updatedReward,
      message: "Recompensa actualizada y disponible para reclamar, escribenos!",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(error);
    }
    next(error);
  }
};

export const deleteReward = async (req, res) => {
  try {
    await RewardService.deleteReward(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Recompensa eliminada con éxito.",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(error);
    }
    next(error);
  }
};
