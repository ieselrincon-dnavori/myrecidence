const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de CORS para Ionic (localhost:8100)
app.use(cors({ origin: "http://localhost:8100" }));

const db = require('./models');

// Sincronización de la base de datos
// { alter: true } crea la tabla 'tasks' y añade la clave foránea 'userRecidenceId'
db.sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced (Ensuring "tasks" table and relations exist).');
});

// Rutas de Residentes
require('./routes/user.recidence.routes.js')(app);
// Rutas de Autenticación
require('./routes/auth.routes.js')(app);
// Rutas de Tareas <-- NUEVAS RUTAS
//require('./routes/task.routes.js')(app);
require("./routes/medical.assistant.routes.js")(app);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));