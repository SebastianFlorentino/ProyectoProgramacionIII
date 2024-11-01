const bcrypt = require('bcrypt');
const password = "admin123"; // Contraseña para el administrador
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
$2b$10$2YjBC3iDFYrmd3rCLaN.BOfr0Ba/TCVM8gG8FosYRVEYPtt3n6hzi
