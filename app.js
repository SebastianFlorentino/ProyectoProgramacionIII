const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config(); // Cargar variables de entorno

const app = express();

// Configuración de Handlebars como motor de plantillas
app.engine(
  'hbs',
  engine({
    extname: '.hbs', // Extensión de los archivos de plantillas
    defaultLayout: 'main', // Layout predeterminado
    layoutsDir: path.join(__dirname, 'views/layouts'), // Directorio de layouts
    helpers: {
      eq: (a, b) => a === b, // Helper para comparar igualdad
    }
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(
  session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
  })
);

// Configuración para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación (registro e inicio de sesión)
app.use('/reservations', reservationRoutes); // Rutas de reservaciones (usuarios)
app.use('/admin', adminRoutes); // Rutas de administrador (edición y eliminación de reservaciones)

// Ruta raíz para redireccionar al inicio de sesión
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Ruta de error 404 para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});