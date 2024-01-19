import Role from "../models/roles.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError } = CustomErrors;

class RoleService {
  async createRole(data) {
    try {
      const newRole = new Role(data);
      return await newRole.save();
    } catch (error) {
      throw new DatabaseError("Error al crear el rol.");
    }
  }

  async getRoles(options = {}) {
    try {
      const roles = await Role.find(options);
      if (!roles) {
        throw new NotFoundError("Rol no encontrado.");
      }
      return roles;
    } catch (error) {
      throw new DatabaseError("Error al obtener los roles.");
    }
  }

  async getRole() {
    try {
      const rol = await Role.findOne({ options });
      if (!rol) {
        throw new NotFoundError("Rol no encontrado.");
      }
      return rol;
    } catch (error) {
      throw new DatabaseError("Error al obtener los roles.");
    }
  }

  async updateRole(roleId, updateData) {
    try {
      const updatedRole = await Role.findByIdAndUpdate(roleId, updateData, {
        new: true,
      });
      if (!updatedRole) {
        throw new NotFoundError("Rol no encontrado para actualizar.");
      }
      return updatedRole;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al actualizar el rol.");
    }
  }

  async deleteRole(roleId) {
    try {
      const deleteRole = await Role.findByIdAndDelete(roleId);
      if (!deleteRole) {
        throw new NotFoundError("Rol no encontrado para eliminar.");
      }
      return deleteRole;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al eliminar el rol.");
    }
  }
}

export default new RoleService();
