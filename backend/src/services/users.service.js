const usersRepo = require('../repositories/users.repository');
const { ApiError } = require('../middleware/error.middleware');

function requireString(value, fieldName, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return { field: fieldName, message: `${fieldName} must be a non-empty string` };
  }
  return null;
}

function validateUserDto(dto) {
  const errors = [];
  
  const e1 = requireString(dto.name, "name", 2);
  if (e1) errors.push(e1);
  
  const e2 = requireString(dto.email, "email", 5);
  if (e2) errors.push(e2);
  
  return errors;
}

module.exports = {
  getAllUsers: () => {
    return usersRepo.getAll();
  },
  
  getUserById: (id) => {
    const user = usersRepo.getById(Number(id));
    if (!user) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }
    return user;
  },
  
  createUser: (dto) => {
    const errors = validateUserDto(dto);
    if (errors.length > 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    return usersRepo.add(dto);
  },
  
  updateUser: (id, dto) => {
    const errors = validateUserDto(dto);
    if (errors.length > 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    const updated = usersRepo.update(Number(id), dto);
    if (!updated) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }
    return updated;
  },
  
  deleteUser: (id) => {
    const deleted = usersRepo.delete(Number(id));
    if (!deleted) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }
    return true;
  }
};