const shiftsRepo = require('../repositories/shifts.repository');
const { ApiError } = require('../middleware/error.middleware');

function requireString(value, fieldName, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return { field: fieldName, message: `${fieldName} must be a non-empty string` };
  }
  return null;
}


function validateShiftDto(dto) {
  const errors = [];
  
  const e1 = requireString(dto.userName, "userName", 3);
  if (e1) errors.push(e1);
  
  const e2 = requireString(dto.date, "date", 1);
  if (e2) errors.push(e2);
  
  const e3 = requireString(dto.status, "status", 1);
  if (e3) errors.push(e3);

  return errors;
}

module.exports = {
  getAllShifts: () => {
    return shiftsRepo.getAll();
  },
  
  getShiftById: (id) => {
    const shift = shiftsRepo.getById(Number(id));
    if (!shift) {
      throw new ApiError(404, "NOT_FOUND", "Shift not found");
    }
    return shift;
  },
  
  createShift: (dto) => {
    const errors = validateShiftDto(dto);
    if (errors.length > 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    return shiftsRepo.add(dto);
  },
  
  updateShift: (id, dto) => {
    const errors = validateShiftDto(dto);
    if (errors.length > 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    const updated = shiftsRepo.update(Number(id), dto);
    if (!updated) {
      throw new ApiError(404, "NOT_FOUND", "Shift not found");
    }
    return updated;
  },
  
  deleteShift: (id) => {
    const deleted = shiftsRepo.delete(Number(id));
    if (!deleted) {
      throw new ApiError(404, "NOT_FOUND", "Shift not found");
    }
    return true;
  }
};