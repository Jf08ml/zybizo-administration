import jwt from "jsonwebtoken";
const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
import User from "../models/users";
import Role from "../models/roles";

async function signup(req, res) {
  try {
    const { email, password } = req.body;

    const standardRole = await Role.findOne({ name: "Administrator" });

    if (!standardRole) {
      return res
        .status(500)
        .json({ result: "error", message: "Server error role" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ result: "errorEmail", message: "Email already exists" });
      }
    }

    const user = new User({
      email,
      password,
      role: standardRole._id,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({ result: "success", token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "error", message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    // Buscar al usuario por email o nickname
    const user = await User.findOne({
      $or: [{ email: identifier }],
    });

    // Si el usuario no existe
    if (!user) {
      return res.status(401).json({
        result: "errorNotFound",
        message: "User not found. Please check your email address or nickname.",
      });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        result: "errorPassword",
        message: "Invalid password. Please check your password.",
      });
    }

    const role = await Role.findById(user.role);

    // Generar tokens
    const token = jwt.sign({ id: user._id, role: role.name }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const tokenDuration = 3600; // duración del token en segundos (1 hora)
    const refreshTokenDuration = 86400; // duración del refresh token en segundos (24 horas)
    const now = new Date();
    const tokenExpiration = new Date(now.getTime() + tokenDuration * 1000);
    const refreshTokenExpiration = new Date(
      now.getTime() + refreshTokenDuration * 1000
    );

    // Enviar respuesta
    res.status(200).json({
      result: "success",
      token: token,
      refreshToken: refreshToken,
      role: role.name,
      issuedAt: now,
      tokenExpire: tokenExpiration,
      refreshTokenExpire: refreshTokenExpiration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      result: "error",
      message: "Internal server error. Please try again later.",
    });
  }
}

async function refreshTokens(req, res) {
  try {
    const { refreshTokenUser } = req.body;
    jwt.verify(refreshTokenUser, JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ error: "RefreshTokenError", message: err.name });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "1h",
      });
      const newRefreshToken = jwt.sign(
        { id: user._id, role: user.role },
        JWT_REFRESH_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res
        .status(200)
        .json({ result: "success", token, refreshToken: newRefreshToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUser(req, res) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
}

async function updateUser(req, res) {
  const { nickname, email } = req.body;
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ result: "errorUser", message: "Unauthorized updateUser" });
    }

    // Validar si el nickname ya existe
    const nicknameExists = await User.findOne({
      nickname,
      _id: { $ne: userId },
    });
    if (nicknameExists) {
      return res
        .status(400)
        .json({ result: "errorNickname", message: "Nickname already exists" });
    }

    // Validar si el email ya existe
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      return res
        .status(400)
        .json({ result: "errorEmail", message: "Email already exists" });
    }

    user.nickname = nickname;
    user.email = email;

    await user.save();
    res.status(200).json({
      result: "success",
      message: "User information updated successfully",
    });
  } catch (err) {
    res.status(500).json({ result: "error", message: err });
  }
}

async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ result: "error", message: "Unauthorized updateUser" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        result: "errorpassword",
        message: "Invalid password. Please check your password.",
      });
    }

    user.password = newPassword;

    await user.save();
    res
      .status(200)
      .json({ result: "success", message: "Password update success" });
  } catch (err) {
    res.status(500).json({ result: "error", message: err });
  }
}

async function userRole(req, res) {
  const rolId = req.userRole;
  try {
    const response = await Role.findById(rolId);

    res.status(200).json({
      result: "success",
      message: "Photo update success",
      rol: response,
    });
  } catch (error) {
    res.status(500).json({ message: "servidor error" });
  }
}

export {
  signup,
  login,
  refreshTokens,
  updateUser,
  getUser,
  updatePassword,
  userRole,
};
