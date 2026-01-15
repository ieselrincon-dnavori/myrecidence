const db = require('../models');
const UserRecidence = db.userRecidence;
const MedicalAssistant = db.medicalAssistant; // Importante para validaciones
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const getUploadDir = () => path.resolve(__dirname, '..', 'uploads'); 

const deleteFile = (filename) => {
    if (!filename) return;
    const filePath = path.join(getUploadDir(), filename); 
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath); 
            console.log(`[FILE_CLEANUP] ✅ Archivo eliminado: ${filename}`);
        } catch (error) {
            console.error(`[FILE_CLEANUP] ❌ ERROR:`, error.message);
        }
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = getUploadDir();
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
exports.upload = upload.single('photo');

// --- OPERACIONES CRUD ---

// Crear nueva residencia con validación de cupo
exports.create = async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).send({ message: "El nombre es obligatorio!" });

    // 1. LIMPIEZA IGUAL QUE EN UPDATE
    let assistantId = req.body.medicalAssistantId;
    if (assistantId === 'null' || assistantId === '' || assistantId === undefined) {
        assistantId = null;
    } else {
        assistantId = parseInt(assistantId, 10);
    }

    // 2. VALIDACIÓN DE CUPO
    if (assistantId) {
        const count = await UserRecidence.count({ where: { medicalAssistantId: assistantId } });
        if (count >= 3) {
            return res.status(400).send({ 
                message: "Este asistente ya tiene el cupo máximo de 3 residentes asignados." 
            });
        }
    }

    const userRecidenceData = {
      name: req.body.name,
      medicalAssistantId: assistantId, // <--- Ahora es un número real
      photo: req.file ? req.file.filename : null
    };

    const data = await UserRecidence.create(userRecidenceData);
    
    // Devolvemos el objeto creado
    res.status(201).send({
      ...data.toJSON(), // Usamos toJSON() para consistencia
      image_url: req.file ? `${BASE_URL}/uploads/${req.file.filename}` : null
    });

  } catch (err) {
    res.status(500).send({ message: err.message || "Error creando la residencia." });
  }
};

// Obtener todas las residencias (Corregido y Limpio)
exports.findAll = async (req, res) => {
  try {
    const data = await UserRecidence.findAll({
        include: [{ model: MedicalAssistant, as: 'assistant' }]
    });
    
    const dataWithUrl = data.map(u => {
      const plainObject = u.get({ plain: true }); // Convierte a objeto simple
      
      // Eliminamos la propiedad duplicada que sale null
      delete plainObject.medical_assistant; 

      return {
        ...plainObject,
        image_url: plainObject.photo ? `${BASE_URL}/uploads/${plainObject.photo}` : null
      };
    });
    res.send(dataWithUrl);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }

};
// Actualizar residencia
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    // 1. Extraer el ID del cuerpo de la petición
    let assistantId = req.body.medicalAssistantId;

    // 2. Limpieza de datos: Postman/Ionic pueden enviar 'null' como texto o vacío
    if (assistantId === 'null' || assistantId === '' || assistantId === undefined) {
      assistantId = null;
    } else {
      assistantId = parseInt(assistantId, 10); // Convertir a número entero
    }

    // 3. Preparar objeto de actualización
    const updateData = {
      name: req.body.name,
      medicalAssistantId: assistantId // Usar el valor procesado
    };

    // 4. Manejo de nueva foto si existe
    if (req.file) {
      updateData.photo = req.file.filename;
    }

    // 5. Ejecutar la actualización en BD
    const [num] = await UserRecidence.update(updateData, { where: { id: id } });

    if (num === 1) {
      // Opcional: Recuperar el objeto actualizado para devolverlo completo
      const updatedRecord = await UserRecidence.findByPk(id, {
        include: [{ model: db.medicalAssistant, as: 'assistant' }]
      });
      
      res.send({
        message: "Actualizado con éxito",
        data: {
          ...updatedRecord.toJSON(),
          image_url: updatedRecord.photo ? `http://localhost:8080/uploads/${updatedRecord.photo}` : null
        }
      });
    } else {
      res.status(404).send({ message: "No se encontró el registro o no hay cambios que aplicar." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Eliminar
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const recidenceToDelete = await UserRecidence.findByPk(id);
    const photoFilename = recidenceToDelete?.photo;
    
    const num = await UserRecidence.destroy({ where: { id } });

    if (num === 1) {
        if (photoFilename) deleteFile(photoFilename);
        res.status(204).send();
    } else res.status(404).send({ message: "No se pudo eliminar." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};