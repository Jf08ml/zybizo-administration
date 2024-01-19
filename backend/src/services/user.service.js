import User from "../models/users.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class UserService {
  async createUser(data) {
    try {
      const { email } = data;

      const existingUser = await User.findOne({
        $or: [{ email: email }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new DuplicateKeyError("El email ya está registrado.");
        }
      }

      const newUser = new User(data);
      return await newUser.save();
    } catch (error) {
      throw new DatabaseError("Error al crear el usuario.");
    }
  }

  async getUsers(options = {}) {
    try {
      return await User.find(options);
    } catch (error) {
      throw new DatabaseError("Error al obtener los usuarios.");
    }
  }

  async getUser(options = {}) {
    try {
      const user = await User.findOne(options);
      if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
      }
      return user;
    } catch (error) {
      throw new DatabaseError("Error al actualizar el usuario."); 
    }
  }

  async updateUser(userId, updateData) {
    try {
      const updateduser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
      if (!updateduser) {
        throw new NotFoundError("Usuario no encontrado para actualizar.");
      }
      return updateduser;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al actualizar el usuario.");
    }
  }

  async deleteUser(userId) {
    try {
      const deleteuser = await User.findByIdAndDelete(userId);
      if (!deleteuser) {
        throw new NotFoundError("Usuario no encontrado para eliminar.");
      }
      return deleteuser;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al eliminar el usuario.");
    }
  }
}

export default new UserService();
