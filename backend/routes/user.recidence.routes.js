// Asegúrate de que el nombre del archivo del controlador sea idéntico (fíjate en la 's' final)
const residents = require("../controllers/user.recidence.controllers.js");
const { verifyToken } = require("../middleware/authJwt"); // Importación destructurada
const router = require("express").Router();

module.exports = app => {
    
    // Rutas protegidas
    // Si residents.upload o residents.create no existen, darán error. 
    // Asegúrate de que el controlador tenga esos nombres.
    router.post("/", verifyToken, residents.upload, residents.create);
    router.get("/", verifyToken, residents.findAll);
    router.put("/:id", verifyToken, residents.upload, residents.update);
    router.delete("/:id", verifyToken, residents.delete);

    app.use('/api/users_recidence', router);
};