# Gestión de Residencia

_Sistema de control de residentes y sus asistentes médicos asignados, autenticación mediante login y token temporal._

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

Mira **Deployment** para conocer como desplegar el proyecto.

### Pre-requisitos 📋

_Necesitas tener instalados los siguientes entornos para ejecutar el software:_

* **Node.js** (v18.0.0 o superior)
* **npm** (incluido con Node.js)
* **Ionic CLI** (`npm install -g @ionic/cli`)
* **MySQL** (Servidor local como XAMPP o MySQL Workbench)

### Instalación 🔧

_Sigue estos pasos para configurar el entorno de desarrollo:_

1. **Configurar el Backend:**
_Entra en la carpeta del servidor e instala las dependencias._
```bash
cd backend
npm install
```

2. **Configurar la base de datos:**
_Asegúrate de configurar el archivo config/db.config.js con tus credenciales de MySQL y ejecuta el servidor para sincronizar las tablas._
```bash
node index.js
```

3. **Configurar el Frontend:**
_Entra en la carpeta de la aplicación Ionic e instala las dependencias._
```bash
cd ../frontend
npm install
```

4. **Ejecutar la aplicación:**
_Lanza el servidor de desarrollo de Ionic._
```bash
ionic serve
```
_Para evitar tener que crear una cuenta y volver a poner los datos (correo y contraseña), utilizar el token_

## Construido con 🛠️

_Herramientas utilizadas en el desarrollo:_

* Ionic - El framework para la aplicación móvil/web
* Angular - Framework de desarrollo para la lógica del frontend
* Node.js - Entorno de ejecución para el servidor
* Express - Framework web para la API
* Sequelize - ORM para la gestión de la base de datos MySQL
* JWT - Estándar para la autenticación segura

## Documentación de la API 

 _La API está protegida por JWT (JSON Web Tokens). Todas las peticiones a las rutas de residentes requieren el encabezado Authorization: Bearer <token>._ 

## Configuración de llamadas en postman 📖
_El método para obtener el token, lleva implementando un script para que se guarde automáticamente, en la carpeta raíz de la colección, indicamos que la autorización es mediante Token Bearer y en cada uno de los métodos hijos tiene la autenticación heredada._

## Autenticación 🔑

* POST	/api/auth/register	Registra un nuevo usuario (admin).
* POST	/api/auth/login	Inicia sesión y devuelve el accessToken.
* GET	/api/auth/temp-token	Genera un token temporal de acceso rápido (2h).

## Residentes 🏠

* GET	/api/users_recidence	Lista todos los residentes con sus asistentes.
* POST	/api/users_recidence	Crea un residente. Requiere multipart/form-data para la foto.
* PUT	/api/users_recidence/:id	Actualiza datos de un residente (incluyendo cambio de foto).
* DELETE	/api/users_recidence/:id	Elimina un residente y borra su foto del servidor.
  
## Asistentes Médicos 🏥

* GET	/api/medical_assistants	Obtiene la lista de asistentes y sus residentes asignados.
* POST	/api/medical_assistants	Registra un nuevo asistente médico.
