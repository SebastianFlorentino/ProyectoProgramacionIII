const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');

function readUsers() {
  if (!fs.existsSync(usersFilePath)) return [];
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Obtener todos los usuarios
exports.getAllUsers = () => {
  return readUsers();
};

// Obtener un usuario por su nombre de usuario
exports.findUserByUsername = (username) => {
  const users = readUsers();
  return users.find(user => user.username === username);
};

// Obtener un usuario por su ID
exports.getUserById = (id) => {
  const users = readUsers();
  return users.find(user => user.id === id);
};

// Agregar un nuevo usuario
exports.addUser = (user) => {
  const users = readUsers();
  users.push(user);
  saveUsers(users);
};

// Actualizar un usuario existente
exports.updateUser = (id, updatedData) => {
  const users = readUsers();
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData }; // Actualizar solo los campos enviados
    saveUsers(users);
  }
};

// Eliminar un usuario
exports.deleteUser = (id) => {
  const users = readUsers();
  const updatedUsers = users.filter(user => user.id !== id);
  saveUsers(updatedUsers);
};
