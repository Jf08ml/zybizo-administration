import Reward from "../models/rewards";

export const createReward = async (req, res) => {
  try {
    const { phoneNumber, usernameInsta } = req.body.reward;

    const phoneExists = await Reward.findOne({ phoneNumber });
    if (phoneExists) {
      return res
        .status(400)
        .json({ message: "El número de teléfono ya está registrado." });
    }

    const usernameExists = await Reward.findOne({ usernameInsta });
    if (usernameExists) {
      return res.status(400).json({
        message: "El nombre de usuario de Instagram ya está registrado.",
      });
    }

    const newReward = new Reward(req.body.reward);
    await newReward.save();
    res
      .status(201)
      .json({
        message: "Recompensa guardada y disponible para reclamar, escribenos!",
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los Rewards
export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json(rewards);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Obtener un Reward por ID
export const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) res.status(404).json({ message: "Reward no encontrado" });
    res.status(200).json(reward);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Actualizar un Reward
export const updateReward = async (req, res) => {
  try {
    const updatedReward = await Reward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedReward);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un Reward
export const deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) res.status(404).json({ message: "Reward no encontrado" });
    res.status(200).json({ message: "Reward eliminado con éxito" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
