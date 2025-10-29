import jwt from "jsonwebtoken";
import UserService from "../services/user.service";
import RoleService from "../services/role.service";
import sendResponse from "../utils/response";
import User from "../models/users";
import Role from "../models/roles";
import CustomErrors from "../errors/CustomErrors.js";

const { NotFoundError, DuplicateKeyError } = CustomErrors;

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

async function signup(req, res, next) {
  try {
    const { email, password } = req.body;

    const standardRole = await RoleService.getRoles({ name: "Standard" });
    const user = {
      email,
      password,
      role: standardRole[0]._id,
    };
    const createUser = await UserService.createUser(user);

    const { token, refreshToken } = configurarTokens(createUser);

    const accessToken = {
      token,
      refreshToken,
    };

    const data = { user, accessToken };
    sendResponse(res, 201, data, "User created successfully");
  } catch (error) {
    if (error instanceof DuplicateKeyError) {
      return sendResponse(res, 409, null, error.message);
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por email
    const user = await UserService.getUser({ email });

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(
        res,
        401,
        null,
        "Verifique credenciales, email o contraseña incorrectos."
      );
    }

    const { token, refreshToken } = configurarTokens(user);

    const accessToken = {
      token,
      refreshToken,
    };

    const data = { user, accessToken };

    sendResponse(res, 201, data, "The user has logged in successfully.");
  } catch (error) {
    if (error instanceof NotFoundError) {
      return sendResponse(res, 404, null, error.message);
    }
    next(error);
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

      const user = await User.findById(decoded.id).populate("role");
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = jwt.sign({ id: user._id, role: user.role._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      const newRefreshToken = jwt.sign(
        { id: user._id, role: user.role._id },
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

// Funciones auxiliares
function configurarTokens(user) {
  const token = jwt.sign({ id: user._id, role: user.role._id || user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role._id || user.role },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "24h",
    }
  );

  const tokenDuration = 3600;
  const refreshTokenDuration = 86400;
  const now = new Date();
  const tokenExpiration = new Date(now.getTime() + tokenDuration * 1000);
  const refreshTokenExpiration = new Date(
    now.getTime() + refreshTokenDuration * 1000
  );

  return { token, refreshToken, tokenExpiration, refreshTokenExpiration };
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
