const fs = require('fs');
const path = require('path');
const reservationsFilePath = path.join(__dirname, '../data/reservations.json');

function readReservations() {
  try {
    if (!fs.existsSync(reservationsFilePath)) return [];
    const data = fs.readFileSync(reservationsFilePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error leyendo el archivo reservations.json:", error);
    return [];
  }
}

function saveReservations(reservations) {
  try {
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
  } catch (error) {
    console.error("Error guardando en el archivo reservations.json:", error);
  }
}

exports.getAllReservations = () => {
  return readReservations();
};

// Obtener reservaciones por userId
exports.getReservationsByUserId = (userId) => {
  const reservations = readReservations();
  return reservations.filter(reservation => reservation.userId === userId);
};

// Generar el siguiente ID de reservación
exports.getNextId = () => {
  const reservations = readReservations();
  return reservations.length ? reservations[reservations.length - 1].id + 1 : 1;
};

// Guardar una nueva reservación
exports.saveReservation = (reservation) => {
  const reservations = readReservations();
  reservations.push(reservation);
  saveReservations(reservations);
};

// Obtener una reservación por ID
exports.getReservationById = (id) => {
  const reservations = readReservations();
  return reservations.find(reservation => reservation.id === parseInt(id));
};

// Actualizar una reservación por ID
exports.updateReservation = (id, updatedData) => {
  const reservations = readReservations();
  const index = reservations.findIndex(reservation => reservation.id === parseInt(id));
  if (index !== -1) {
    reservations[index] = { ...reservations[index], ...updatedData };
    saveReservations(reservations);
  }
};

// Eliminar una reservación por ID
exports.deleteReservation = (id) => {
  const reservations = readReservations();
  const updatedReservations = reservations.filter(reservation => reservation.id !== parseInt(id));
  saveReservations(updatedReservations);
};
