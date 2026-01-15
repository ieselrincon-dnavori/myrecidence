module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
    let router = require("express").Router();

    // Ruta para registrar un nuevo empleado/admin
    // POST http://localhost:8080/api/auth/register
    router.post("/register", auth.register);

    // Ruta para iniciar sesión (NUEVA)
    // POST http://localhost:8080/api/auth/login
    router.post("/login", auth.login);

    router.get("/temp-token", auth.generateToken);

    app.use('/api/auth', router);
};