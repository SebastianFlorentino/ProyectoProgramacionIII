const reservationModel = require('../models/reservationModel');
const userModel = require('../models/userModel'); // Importar el modelo de usuarios

// Renderizar el Dashboard de Administrador con usuarios y reservaciones
exports.adminDashboard = (req, res) => {
  const users = userModel.getAllUsers(); // Obtener todos los usuarios
  const reservations = reservationModel.getAllReservations(); // Obtener todas las reservaciones
  res.render('adminDashboard', { users, reservations });
};

// Editar usuario
exports.editUser = (req, res) => {
  const user = userModel.getUserById(req.params.id);
  if (!user) {
    return res.status(404).send('Usuario no encontrado');
  }
  res.render('editUser', { user });
};

// Actualizar usuario
exports.updateUser = (req, res) => {
  userModel.updateUser(req.params.id, req.body);
  res.redirect('/admin/dashboard');
};

// Eliminar usuario
exports.deleteUser = (req, res) => {
  userModel.deleteUser(req.params.id);
  res.redirect('/admin/dashboard');
};

// Editar reservación
exports.editReservation = (req, res) => {
  const reservation = reservationModel.getReservationById(req.params.id);
  if (!reservation) {
    return res.status(404).send('Reservación no encontrada');
  }
  res.render('editReservation', { reservation });
};

// Actualizar reservación
exports.updateReservation = (req, res) => {
  reservationModel.updateReservation(req.params.id, req.body);
  res.redirect('/admin/dashboard');
};

// Eliminar reservación
exports.deleteReservation = (req, res) => {
  reservationModel.deleteReservation(req.params.id);
  res.redirect('/admin/dashboard');
};
