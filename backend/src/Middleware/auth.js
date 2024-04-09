import jwt from "jsonwebtoken";
import Role from "../models/roles";

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ result: "error", message: "No token provided." });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userId = decodedToken.id;
    Role.findById(decodedToken.role).then((role) => {
      if(!role){
        return res.status(404).json({ result: "error", message: "Role not found." });
      }

      req.userRole = role._id;
      req.userPermission = role.permissions;
      next();
    });
  } catch (error) {
    return res.status(401).json({ result: "error", message: error.message });
  }
}

export default verifyToken;
