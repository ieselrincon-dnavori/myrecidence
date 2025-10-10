// user.recidence.controllers.js

const db = require('../models');
const UserRecidence = db.recidence;
const Op = db.Sequelize.Op;

// Create and Save a new UserRecidence
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const userRecidence = {
        name: req.body.name,
        medical_assistant: req.body.medical_assistant
    };

    UserRecidence.create(userRecidence)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the UserRecidence."
            });
        });
};

// Retrieve all UserRecidence from the database.
exports.findAll = (req, res) => {
    UserRecidence.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users_recidence."
            });
        });
};

// Find a single UserRecidence with an id
exports.findOne = (req, res) => {
    // Si bien no lo necesitas ahora, la implementación sería similar a findAll pero con .findByPk(id)
};

// ------------------------------------------------------------------
// ✅ Implementación de ACTUALIZAR (UPDATE)
// ------------------------------------------------------------------
// Update a UserRecidence by the id in the request
exports.update = (req, res) => {
    const id = req.params.id; // ID del registro a actualizar

    // req.body contiene los nuevos datos (name, medical_assistant)
    UserRecidence.update(req.body, {
        where: { id: id } // Sequelize solo actualizará el registro con este ID
    })
    .then(num => {
        if (num[0] === 1) { // Sequelize devuelve un array [número de filas afectadas]
            res.send({
                message: "La Residencia fue actualizada con éxito."
            });
        } else {
            // Si num es 0, el ID no existe o no se hizo ningún cambio
            res.status(404).send({
                message: `No se puede actualizar la Residencia con id=${id}. Tal vez no fue encontrada.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error al actualizar la Residencia con id=" + id
        });
    });
};

// ------------------------------------------------------------------
// ✅ Implementación de BORRADO (DELETE)
// ------------------------------------------------------------------
// Delete a UserRecidence with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    UserRecidence.destroy({
        where: { id: id } // Sequelize eliminará el registro con este ID
    })
    .then(num => {
        if (num === 1) {
            // Sequelize devuelve 1 si se eliminó un registro
            res.status(204).send(); // 204 No Content: Éxito en la eliminación sin contenido de retorno
        } else {
            // El registro no existía
            res.status(404).send({
                message: `No se puede eliminar la Residencia con id=${id}. Tal vez no fue encontrada.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "No se pudo eliminar la Residencia con id=" + id
        });
    });
};

// Delete all UserRecidence from the database.
exports.deleteAll = (req, res) => {}; // Lo dejamos vacío por ahora.