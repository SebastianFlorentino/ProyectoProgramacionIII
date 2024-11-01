const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Ruta para mostrar la página de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para manejar el registro de usuario
router.post('/register', authController.register);

// Ruta para mostrar la página de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para manejar el inicio de sesión
router.post('/login', authController.login);

// Ruta para manejar el cierre de sesión
router.get('/logout', authController.logout);

module.exports = router;
