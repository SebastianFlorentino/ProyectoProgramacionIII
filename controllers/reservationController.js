const reservationModel = require('../models/reservationModel');
const nodemailer = require('nodemailer');

// Renderiza la página de creación de una nueva reservación
exports.newReservation = (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect('/auth/login'); // Redirigir al inicio de sesión si no hay un usuario autenticado
  }
  res.render('reservation');
};

// Crear una nueva reservación
exports.createReservation = (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect('/auth/login');
  }

  const { name, people, date, time, email } = req.body;

  const reservation = {
    id: reservationModel.getNextId(),
    userId: req.session.user.id, // Asociar la reservación al ID del usuario de la sesión
    name,
    people,
    date,
    time,
    email,
    confirmationCode: Math.random().toString(36).substr(2, 8)
  };

  reservationModel.saveReservation(reservation);
  sendConfirmationEmail(email, reservation);
  res.redirect('/reservations/list');
};

// Lista de reservaciones
exports.listReservations = (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect('/auth/login');
  }

  const userId = req.session.user.id;
  const userReservations = reservationModel.getReservationsByUserId(userId);

  if (userReservations.length === 0) {
    res.redirect('/reservations/new');
  } else {
    res.render('reservationsList', { reservations: userReservations });
  }
};

// Renderizar la página de edición de una reservación
exports.editReservation = (req, res) => {
  const reservation = reservationModel.getReservationById(req.params.id);

  if (!reservation) {
    return res.status(404).send('Reservación no encontrada');
  }

  // Verificar si el usuario tiene permiso para editar la reservación
  if (req.session.user.role === 'admin') {
    // Mostrar la vista completa para el administrador
    res.render('editReservationAdmin', { reservation });
  } else if (reservation.userId === req.session.user.id) {
    // Mostrar una vista limitada para el usuario regular
    res.render('editReservationUser', { reservation });
  } else {
    return res.status(403).render('403', { message: 'No tienes permiso para editar esta reservación' });
  }
};

// Actualizar una reservación
exports.updateReservation = (req, res) => {
  const reservation = reservationModel.getReservationById(req.params.id);

  if (!reservation) {
    return res.status(404).send('Reservación no encontrada');
  }

  // Verificar permisos de edición
  if (req.session.user.role === 'admin' || reservation.userId === req.session.user.id) {
    reservationModel.updateReservation(req.params.id, req.body);
    return res.redirect('/reservations/list');
  } else {
    return res.status(403).render('403', { message: 'No tienes permiso para actualizar esta reservación' });
  }
};

// Eliminar una reservación
exports.deleteReservation = (req, res) => {
  const reservation = reservationModel.getReservationById(req.params.id);

  if (!reservation) {
    return res.status(404).send('Reservación no encontrada');
  }

  // Verificar permisos de eliminación
  if (req.session.user.role === 'admin' || reservation.userId === req.session.user.id) {
    reservationModel.deleteReservation(req.params.id);
    return res.redirect('/reservations/list');
  } else {
    return res.status(403).render('403', { message: 'No tienes permiso para eliminar esta reservación' });
  }
};

// Enviar correo de confirmación
function sendConfirmationEmail(email, reservation) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmación de Reservación',
    text: `Detalles de tu reservación:\nNombre: ${reservation.name}\nNúmero de personas: ${reservation.people}\nFecha: ${reservation.date}\nHora: ${reservation.time}\nCódigo de confirmación: ${reservation.confirmationCode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error enviando el correo:", error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}
