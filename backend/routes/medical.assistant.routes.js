module.exports = app => {
    const medicalAssistants = require("../controllers/medical.assistant.controller.js");
    var router = require("express").Router();

    // Crear asistente
    router.post("/", medicalAssistants.create);

    // Listar todos (Esta es la que llamará tu Select en Ionic)
    router.get("/", medicalAssistants.findAll);

    // Eliminar asistente
    router.delete("/:id", medicalAssistants.delete);
    router.put("/:id", medicalAssistants.update);
    
    app.use('/api/medical-assistants', router);
};