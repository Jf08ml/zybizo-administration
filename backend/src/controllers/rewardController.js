import RewardService from "../services/reward.service";
import CustomErrors from "../errors/CustomErrors.js";
import sendResponse from "../utils/response";

const { NotFoundError, ValidationError } = CustomErrors;

export const createReward = async (req, res, next) => {
  try {
    const newReward = await RewardService.createReward(req.body.reward);
    sendResponse(
      res,
      201,
      newReward,
      "Recompensa guardada y disponible para reclamar, ¡escríbenos!"
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return sendResponse(res, 400, null, error.message);
    }
    next(error);
  }
};

export const getRewards = async (req, res, next) => {
  try {
    const rewards = await RewardService.getRewards();
    sendResponse(
      res,
      200,
      rewards,
      rewards.length > 0
        ? "Recompensas encontradas."
        : "No se encontraron recompensas."
    );
  } catch (error) {
    next(error);
  }
};

export const getRewardById = async (req, res, next) => {
  try {
    const reward = await RewardService.getReward(req.params.id);
    sendResponse(res, 200, reward, "Recompensa encontrada.");
  } catch (error) {
    if (error instanceof NotFoundError) {
      return sendResponse(res, 404, null, error.message);
    }
    next(error);
  }
};

export const updateReward = async (req, res, next) => {
  try {
    const updatedReward = await RewardService.updateReward(
      req.params.id,
      req.body.reward
    );
    sendResponse(
      res,
      200,
      updatedReward,
      "Recompensa actualizada y disponible para reclamar, ¡escríbenos!"
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return sendResponse(res, 404, null, error.message);
    }
    next(error);
  }
};

export const deleteReward = async (req, res, next) => {
  try {
    await RewardService.deleteReward(req.params.id);
    sendResponse(res, 200, null, "Recompensa eliminada con éxito.");
  } catch (error) {
    if (error instanceof NotFoundError) {
      return sendResponse(res, 404, null, error.message);
    }
    next(error);
  }
};
