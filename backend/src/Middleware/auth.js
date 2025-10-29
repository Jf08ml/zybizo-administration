import jwt from "jsonwebtoken";
import Role from "../models/roles.js";

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ result: "error", message: "No token provided." });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", {
      id: decodedToken.id,
      role: decodedToken.role,
      roleType: typeof decodedToken.role
    });
    
    req.userId = decodedToken.id;
    req.user = { id: decodedToken.id, role: decodedToken.role };
    
    Role.findById(decodedToken.role).then((role) => {
      if(!role){
        console.error("Role not found for ID:", decodedToken.role);
        return res.status(404).json({ result: "error", message: "Role not found." });
      }

      req.userRole = role._id;
      req.userPermission = role.permissions;
      next();
    }).catch((error) => {
      console.error("Error verifying role:", error);
      return res.status(500).json({ result: "error", message: "Error verifying role." });
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ result: "error", message: error.message });
  }
}

// Alias para compatibilidad
const authenticateToken = verifyToken;

export default verifyToken;
export { authenticateToken };
