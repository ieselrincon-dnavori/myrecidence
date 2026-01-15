const db = require("../models");
const User = db.users;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// TOKEN

exports.generateToken = (req, res) => {
  
  const user = { id: 1, role: 'admin' }; 
  
  
    const token = jwt.sign(user, "Mayonesa_Casera", {
    expiresIn: "2h"
  });

  res.json({ accessToken: token });
};
// --- REGISTRO ---
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ message: "Faltan datos obligatorios" });
        }

        const user = await User.create({
            username,
            email,
            password 
        });

        res.status(201).send({
            message: "Usuario registrado con éxito",
            userId: user.id
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error al registrar el usuario"
        });
    }
};

// --- LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar al usuario
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        // 2. Comparar contraseña
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Contraseña incorrecta."
            });
        }

        // 3. GENERAR EL TOKEN (Esto es lo que faltaba)
        // Usamos los datos reales del usuario y la misma clave "Mayonesa_Casera"
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            "Mayonesa_Casera", 
            { expiresIn: "2h" }
        );

        // 4. Respuesta exitosa INCLUYENDO el token
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            accessToken: token // <--- ¡AHORA SÍ ENVIAMOS LA LLAVE!
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};