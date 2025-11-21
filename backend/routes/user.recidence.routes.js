module.exports = app => {
    const residents = require("../controllers/user.recidence.controllers.js");
    const router = require("express").Router();

    // POST (Crear) - Usa el middleware de subida y luego el controlador
    router.post("/", residents.upload, residents.create);

    // GET (Recuperar todos)
    router.get("/", residents.findAll);

    // GET (Recuperar uno por ID)
    // El controlador de residentes no tiene findOne, pero la ruta es correcta si lo añades:
    // router.get("/:id", residents.findOne); 

    // PUT (Actualizar por ID) - ¡CRÍTICO! Usa el middleware 'upload' para manejar la posible nueva foto
    router.put("/:id", residents.upload, residents.update);

    // DELETE (Eliminar por ID)
    router.delete("/:id", residents.delete);

    // Prefijo de la ruta principal (CORREGIDO para coincidir con tu app)
    app.use('/api/users_recidence', router);
};