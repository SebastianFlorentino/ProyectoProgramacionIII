const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Middleware para verificar si el usuario tiene rol de administrador
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    res.status(403).render('403', { message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
}

// Rutas de administración, protegidas por el middleware isAdmin

// Ruta para mostrar el panel de administrador con todas las reservaciones y usuarios
router.get('/dashboard', isAdmin, adminController.adminDashboard);

// Rutas de Usuarios
router.get('/edit/user/:id', isAdmin, adminController.editUser);       // Mostrar formulario de edición de usuario
router.post('/edit/user/:id', isAdmin, adminController.updateUser);    // Actualizar usuario
router.post('/delete/user/:id', isAdmin, adminController.deleteUser);  // Eliminar usuario

// Rutas de Reservaciones
router.get('/edit/reservation/:id', isAdmin, adminController.editReservation);    // Mostrar formulario de edición de reservación
router.post('/edit/reservation/:id', isAdmin, adminController.updateReservation); // Actualizar reservación
router.post('/delete/reservation/:id', isAdmin, adminController.deleteReservation); // Eliminar reservación

module.exports = router;
