let shifts = [];
let nextId = 1;

module.exports = {
  getAll: () => {
    return shifts;
  },
  
  getById: (id) => {
    return shifts.find(entity => entity.id === id);
  },
  
  add: (entity) => {
    const newItem = { id: nextId++, ...entity };
    shifts.push(newItem);
    return newItem;
  },
  
  update: (id, entity) => {
    const index = shifts.findIndex(item => item.id === id);
    if (index !== -1) {
      shifts[index] = { ...shifts[index], ...entity };
      return shifts[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = shifts.findIndex(item => item.id === id);
    if (index !== -1) {
      shifts.splice(index, 1);
      return true;
    }
    return false;
  }
};