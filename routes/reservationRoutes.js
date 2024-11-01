const express = require('express');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

// Ruta para mostrar el formulario de nueva reservación
router.get('/new', reservationController.newReservation);

// Ruta para manejar la creación de una nueva reservación
router.post('/new', reservationController.createReservation);

// Ruta para listar las reservaciones del usuario
router.get('/list', reservationController.listReservations);

// Ruta para mostrar el formulario de edición de una reservación específica
router.get('/edit/:id', reservationController.editReservation);

// Ruta para manejar la actualización de una reservación específica
router.post('/edit/:id', reservationController.updateReservation);

// Ruta para manejar la eliminación de una reservación específica
router.post('/delete/:id', reservationController.deleteReservation);

module.exports = router;
