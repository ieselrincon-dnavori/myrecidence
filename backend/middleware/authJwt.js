const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) return res.status(403).send({ message: "No hay token" });

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  // DEBE SER LA MISMA CLAVE: Mayonesa_Casera
  jwt.verify(token, "Mayonesa_Casera", (err, decoded) => {
    if (err) return res.status(401).send({ message: "Token inválido" });
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };