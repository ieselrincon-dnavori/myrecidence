🏡 Backend: Gestión de Residentes (Residencia de Tercera Edad)

Este repositorio contiene el servidor backend para el sistema de gestión de residentes y tareas, desarrollado con Node.js, Express, Sequelize y MySQL.

🚀 Inicio Rápido

Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

Node.js (versión 16 o superior).

MySQL (o MariaDB) para la base de datos.

Postman o una herramienta similar para probar las API.

Configuración del Entorno

Instalar dependencias:

npm install


Configurar la Base de Datos:
Asegúrate de que tu archivo de configuración de base de datos (config/db.config.js) apunta a una instancia de MySQL en ejecución con las credenciales correctas.

La base de datos se sincronizará automáticamente al iniciar el servidor (creando las tablas user_recidences y tasks).

Iniciar el Servidor:

node index.js


El servidor se ejecutará en el puerto 8080.

⚙️ Estructura del Proyecto

config/: Archivo de configuración de la base de datos.

controllers/: Contiene la lógica de negocio (CRUD) para Residentes y Tareas.

models/: Definiciones de los modelos de Sequelize (user_recidence y task).

routes/: Definición de las rutas de la API (Endpoints).

uploads/: Carpeta donde se almacenan las fotos de los residentes (gestionada por Multer).

💡 Endpoints de la API

La API expone dos recursos principales: Residentes y Tareas.

1. Residentes (/api/users_recidence)

Este CRUD permite gestionar la información principal de los residentes, incluyendo la subida y limpieza de fotos.

Método

Endpoint

Descripción

Cuerpo (Body)

Notas

GET

/api/users_recidence

Recupera todos los residentes.

N/A



POST

/api/users_recidence

Crea un nuevo residente.

form-data (name, medical_assistant, photo)

La foto es opcional.

PUT

/api/users_recidence/:id

Actualiza un residente.

form-data (name, medical_assistant, photo)

Si se sube photo, la imagen antigua se elimina del disco.

DELETE

/api/users_recidence/:id

Elimina un residente.

N/A

Si el residente tenía foto, esta se elimina del disco.

Ejemplo de URL para PUT/DELETE: http://localhost:8080/api/users_recidence/5

2. Tareas (/api/tasks) ( SIN IMPLEMENTAR)

Este CRUD gestiona las tareas relacionadas con cada residente.

Método

Endpoint

Descripción

Cuerpo (Body)

GET

/api/tasks

Recupera todas las tareas.

N/A

GET

/api/tasks?residentId=X

Filtra tareas por ID de residente.

N/A

POST

/api/tasks

Crea una nueva tarea.

JSON (title, description, status, userRecidenceId)

PUT

/api/tasks/:id

Actualiza una tarea por ID.

JSON (Campos a modificar)

DELETE

/api/tasks/:id

Elimina una tarea por ID.

N/A

⚠️ NOTA Importante sobre Rutas (PUT/DELETE)

Para las operaciones de actualización (PUT) y eliminación (DELETE), el ID del recurso (Residente o Tarea) debe pasarse como parte de la ruta, no como un query parameter.

Formato Correcto: DELETE http://localhost:8080/api/users_recidence/12
Formato Incorrecto: DELETE http://localhost:8080/api/users_recidence?id=12