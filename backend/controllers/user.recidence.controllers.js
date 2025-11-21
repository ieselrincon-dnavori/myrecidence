const db = require('../models');
const UserRecidence = db.userRecidence;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// URL Base del servidor para el frontend
const BASE_URL = 'http://localhost:8080';

// Función auxiliar para construir la ruta completa de la carpeta 'uploads'
// path.resolve() garantiza la ruta absoluta desde la raíz del sistema de archivos
const getUploadDir = () => path.resolve(__dirname, '..', 'uploads'); 

/**
 * Elimina un archivo de la carpeta de subidas.
 * @param {string | null} filename Nombre del archivo a eliminar (ej: 1700000000000.jpg)
 */
const deleteFile = (filename) => {
    if (!filename) return;
    
    // Construimos la ruta COMPLETA del archivo
    const filePath = path.join(getUploadDir(), filename); 
    
    // --- MENSAJES DE DEPURACIÓN CRÍTICOS ---
    console.log(`[FILE_CLEANUP] 🚦 Intentando borrar archivo en ruta: ${filePath}`);

    // Verificamos si el archivo existe antes de intentar borrarlo
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath); 
            console.log(`[FILE_CLEANUP] ✅ Archivo antiguo ELIMINADO correctamente: ${filename}`);
        } catch (error) {
            // ¡ESTO ES LO QUE NECESITO VER! Muestra el error exacto (ej: EPERM, ENOENT)
            console.error(`[FILE_CLEANUP] ❌ ERROR AL ELIMINAR ${filename}:`, error.message);
            console.error(`[FILE_CLEANUP] Ruta que dio error: ${filePath}`);
        }
    } else {
        console.log(`[FILE_CLEANUP] ⚠️ Archivo NO encontrado para borrar: ${filePath}`);
    }
};

// Configuración de Multer
const storage = multer.diskStorage({
  // Usamos la ruta absoluta
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

// Crear nueva residencia
exports.create = async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).send({ message: "El nombre es obligatorio!" });

    const userRecidence = {
      name: req.body.name,
      medical_assistant: req.body.medical_assistant,
      photo: req.file ? req.file.filename : null // Guarda el nombre de archivo
    };

    const data = await UserRecidence.create(userRecidence);
    
    // Devolvemos la URL completa para que el frontend la pueda mostrar
    res.status(201).send({
      ...data.dataValues,
      image_url: req.file ? `${BASE_URL}/uploads/${req.file.filename}` : null
    });

  } catch (err) {
    console.error("Error en create:", err.message);
    res.status(500).send({ message: err.message || "Error creando la residencia." });
  }
};

// Obtener todas las residencias
exports.findAll = async (req, res) => {
  try {
    const data = await UserRecidence.findAll();
    
    // CRUCIAL: Usamos el nombre de archivo (u.photo) para generar la URL COMPLETA
    const dataWithUrl = data.map(u => ({
      ...u.dataValues,
      image_url: u.photo ? `${BASE_URL}/uploads/${u.photo}` : null // Corregido a URL completa
    }));
    res.send(dataWithUrl);
  } catch (err) {
    console.error("Error en findAll:", err.message);
    res.status(500).send({ message: err.message || "Error obteniendo residencias." });
  }
};

// Actualizar residencia
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const updateData = {
      name: req.body.name,
      medical_assistant: req.body.medical_assistant
    };

    let oldPhotoFilename = null;

    // 1. Si se sube un nuevo archivo, buscamos el archivo antiguo
    if (req.file) {
        // Buscamos el registro actual para obtener el nombre del archivo de la foto antigua
        const currentRecidence = await UserRecidence.findByPk(id);
        if (currentRecidence && currentRecidence.photo) {
            oldPhotoFilename = currentRecidence.photo;
        }
        
        // Asignamos el nombre del nuevo archivo a los datos de actualización
        updateData.photo = req.file.filename;
    }

    const [num] = await UserRecidence.update(updateData, { where: { id } });

    if (num === 1) {
        // 2. Si la actualización fue exitosa y existía una foto antigua, la eliminamos
        if (oldPhotoFilename) {
            deleteFile(oldPhotoFilename);
        }

        const newImageUrl = req.file 
            ? `${BASE_URL}/uploads/${req.file.filename}` 
            : null;

        res.send({
            message: "Actualizado correctamente.",
            updated: updateData,
            image_url: newImageUrl
        });
    } else res.status(404).send({ message: "No se pudo actualizar la residencia." });

  } catch (err) {
    console.error("Error en update:", err.message);
    res.status(500).send({ message: err.message || "Error actualizando la residencia." });
  }
};

// Eliminar
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    // 1. Buscamos el registro *antes* de borrarlo de la DB
    const recidenceToDelete = await UserRecidence.findByPk(id);
    let photoFilename = recidenceToDelete ? recidenceToDelete.photo : null;
    
    // 2. Eliminamos el registro de la base de datos
    const num = await UserRecidence.destroy({ where: { id } });

    if (num === 1) {
        // 3. Si se eliminó correctamente de la DB, eliminamos la foto del disco
        if (photoFilename) {
            deleteFile(photoFilename);
        }
        res.status(204).send();
    } else res.status(404).send({ message: "No se pudo eliminar." });
  } catch (err) {
    console.error("Error en delete:", err.message);
    res.status(500).send({ message: err.message || "Error eliminando la residencia." });
  }
};