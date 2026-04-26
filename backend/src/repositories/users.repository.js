let users = [];
let nextId = 1;

module.exports = {
  getAll: () => {
    return users;
  },
  
  getById: (id) => {
    return users.find(entity => entity.id === id);
  },
  
  add: (entity) => {
    const newItem = { id: nextId++, ...entity };
    users.push(newItem);
    return newItem;
  },
  
  update: (id, entity) => {
    const index = users.findIndex(item => item.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...entity };
      return users[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = users.findIndex(item => item.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }
};