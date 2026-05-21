const shiftsRepo = require("../repositories/shifts.repository");

function requireString(value, fieldName, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return { field: fieldName, message: `${fieldName} must be a non-empty string` };
  }
}

function validateShiftDto(dto) {
  const errors = [];
  if (typeof dto.userId !== "number") {
    errors.push({ field: "userId", message: "userId must be a number" });
  }
  const dateErr = requireString(dto.date, "date");
  if (dateErr) errors.push(dateErr);
  const statusErr = requireString(dto.status, "status");
  if (statusErr) errors.push(statusErr);
  return errors;
}

const shiftsService = {
  getAllShifts: async (filters) => {
    return await shiftsRepo.getAll(filters);
  },

  getShiftById: async (id) => {
    const shift = await shiftsRepo.getById(id);
    if (!shift) {
      throw { status: 404, code: "NOT_FOUND", message: "Shift not found" };
    }
    return shift;
  },

  createShift: async (dto) => {
    const errors = validateShiftDto(dto);
    if (errors.length > 0) {
      throw { status: 400, code: "VALIDATION_ERROR", message: "Invalid request body", details: errors };
    }
    try {
      return await shiftsRepo.add(dto);
    } catch (err) {
      if (String(err.message).includes("FOREIGN KEY constraint failed")) {
        throw { status: 400, code: "BAD_REQUEST", message: "User with this userId does not exist" };
      }
      throw err;
    }
  },

  updateShift: async (id, dto) => {
    const errors = validateShiftDto(dto);
    if (errors.length > 0) {
      throw { status: 400, code: "VALIDATION_ERROR", message: "Invalid request body", details: errors };
    }
    try {
      const updatedShift = await shiftsRepo.update(id, dto);
      if (!updatedShift) {
        throw { status: 404, code: "NOT_FOUND", message: "Shift not found" };
      }
      return updatedShift;
    } catch (err) {
      if (String(err.message).includes("FOREIGN KEY constraint failed")) {
        throw { status: 400, code: "BAD_REQUEST", message: "User with this userId does not exist" };
      }
      throw err;
    }
  },

  deleteShift: async (id) => {
    const isDeleted = await shiftsRepo.delete(id);
    if (!isDeleted) {
      throw { status: 404, code: "NOT_FOUND", message: "Shift not found" };
    }
    return true;
  }
};

module.exports = shiftsService;