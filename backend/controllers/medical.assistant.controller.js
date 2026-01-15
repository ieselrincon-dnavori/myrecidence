const db = require("../models");
const MedicalAssistant = db.medicalAssistant;
const Resident = db.residents;

// Crear un nuevo Asistente Médico
exports.create = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({ message: "¡El nombre es obligatorio!" });
    }

    const assistant = {
      name: req.body.name,
      specialty: req.body.specialty || "General"
    };

    const data = await MedicalAssistant.create(assistant);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al crear el asistente." });
  }
};

// Obtener todos los asistentes (Ideal para el desplegable de Ionic)
exports.findAll = (req, res) => {
  MedicalAssistant.findAll({
    include: [{
      model: Resident,
      as: "residents" // Este alias debe coincidir con tu modelo
    }]
  })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Eliminar un asistente
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await MedicalAssistant.destroy({ where: { id: id } });
    if (num === 1) {
      res.send({ message: "Asistente eliminado correctamente." });
    } else {
      res.status(404).send({ message: "No se encontró el asistente." });
    }
  } catch (err) {
    res.status(500).send({ message: "Error al eliminar el asistente." });
  }
};

exports.findAll = (req, res) => {
  MedicalAssistant.findAll({ include: ["residents"] }) 
    .then(data => res.send(data));
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    await MedicalAssistant.update(req.body, { where: { id: id } });
    res.send({ message: "Asistente actualizado." });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar." });
  }
};