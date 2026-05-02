const usersRepo = require("../repositories/users.repository");

function requireString(value, fieldName, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return { field: fieldName, message: `${fieldName} must be a non-empty string` };
  }
}

function validateUserDto(dto) {
  const errors = [];
  const emailErr = requireString(dto.email, "email");
  if (emailErr) errors.push(emailErr);
  const nameErr = requireString(dto.name, "name");
  if (nameErr) errors.push(nameErr);
  return errors;
}

const usersService = {
  getAllUsers: async () => {
    return await usersRepo.getAll();
  },

  getUserById: async (id) => {
    const user = await usersRepo.getById(id);
    if (!user) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
    return user;
  },

  createUser: async (dto) => {
    const errors = validateUserDto(dto);
    if (errors.length > 0) {
      throw { status: 400, code: "VALIDATION_ERROR", message: "Invalid request body", details: errors };
    }
    try {
      return await usersRepo.add(dto);
    } catch (err) {
      if (String(err.message).includes("UNIQUE constraint failed")) {
        throw { status: 409, code: "CONFLICT", message: "Email already exists" };
      }
      throw err;
    }
  },

  updateUser: async (id, dto) => {
    const errors = validateUserDto(dto);
    if (errors.length > 0) {
      throw { status: 400, code: "VALIDATION_ERROR", message: "Invalid request body", details: errors };
    }
    try {
      const updatedUser = await usersRepo.update(id, dto);
      if (!updatedUser) {
        throw { status: 404, code: "NOT_FOUND", message: "User not found" };
      }
      return updatedUser;
    } catch (err) {
      if (String(err.message).includes("UNIQUE constraint failed")) {
        throw { status: 409, code: "CONFLICT", message: "Email already exists" };
      }
      throw err;
    }
  },

  deleteUser: async (id) => {
    const isDeleted = await usersRepo.delete(id);
    if (!isDeleted) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
    return true;
  }
};

module.exports = usersService;