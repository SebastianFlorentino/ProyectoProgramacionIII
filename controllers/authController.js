const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Importar uuid para generar IDs únicos
const usersFilePath = path.join(__dirname, '../data/users.json');
const reservationsFilePath = path.join(__dirname, '../data/reservations.json'); // Archivo de reservaciones

// Función para leer los usuarios
function readUsers() {
  try {
    if (!fs.existsSync(usersFilePath)) return [];
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error leyendo el archivo users.json:", error);
    return [];
  }
}

// Función para guardar los usuarios
function saveUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error guardando en el archivo users.json:", error);
  }
}

// Función para leer las reservaciones
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

// Registro de usuario
exports.register = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  // Verificar si el usuario ya existe
  if (users.find(user => user.username === username)) {
    return res.render('register', { message: 'El usuario ya existe' });
  }

  // Generar un ID único para el usuario y hash de la contraseña
  const userId = uuidv4();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: userId, username, password: hashedPassword, role: 'user' }; // Añadir `id` y rol `user` por defecto
  users.push(newUser);
  saveUsers(users);

  res.redirect('/auth/login');
};

// Inicio de sesión
exports.login = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.render('login', { message: 'El usuario no está registrado' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.render('login', { message: 'Contraseña incorrecta' });
  }

  // Guardar el id del usuario y su rol en la sesión
  req.session.user = { id: user.id, username: user.username, role: user.role };

  console.log("Sesión de usuario iniciada:", req.session.user); // Mensaje de depuración para verificar la sesión

  // Verificar si el usuario es administrador
  if (user.role === 'admin') {
    return res.redirect('/admin/dashboard'); // Redirigir al panel de administración si es administrador
  }

  // Si el usuario no es administrador, verificar si tiene reservaciones
  const reservations = readReservations();
  const userReservations = reservations.filter(reservation => reservation.userId === user.id);

  if (userReservations.length === 0) {
    // Si no tiene reservaciones, redirigir a la página para crear una nueva reservación
    return res.redirect('/reservations/new');
  } else {
    // Si tiene reservaciones, redirigir a la lista de reservaciones
    return res.redirect('/reservations/list');
  }
};

// Cerrar sesión
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar la sesión:", err);
      return res.redirect('/'); // En caso de error, redirigir a la página de inicio
    }
    console.log("Sesión de usuario cerrada."); // Mensaje de depuración
    res.render('logout'); // Renderizar la página de agradecimiento
  });
};
