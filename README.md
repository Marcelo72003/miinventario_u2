# Proyecto: MiInventarioExpress

## Datos del estudiante

- **Nombre:** Marcelo Darwin Peña Ochoa
- **Carrera:** Ingeniería de Software
- **Asignatura:** Aplicaciones Web
- **Docente:**
- **Unidad:** 2
- **Fecha:** 09/11/2025

### 1. Clonar el repositorio

git clone https://github.com/Marcelo72003/miinventario_u2.git

---

## Descripción general

MiInventarioExpress es una aplicación web desarrollada con **Node.js**, **Express**, **MongoDB** y **Handlebars**, que permite a los usuarios autenticados gestionar un inventario de productos y comunicarse mediante un chat en tiempo real.

El sistema incluye autenticación, gestión de productos, roles de usuario, chat y persistencia de datos con MongoDB.

---

## Tecnologías utilizadas

- **Backend:** Node.js, Express.js
- **Frontend:** Handlebars, HTML, CSS, JavaScript
- **Base de datos:** MongoDB
- **Comunicación en tiempo real:** Socket.io
- **Sesiones y autenticación:** express-session, connect-mongo
- **Validaciones:** express-validator

---

## Funcionalidades principales

### 1. Autenticación de usuarios

- Registro y login con credenciales seguras.
- Roles de usuario: _administrador_ y _usuario_.
- Validaciones de datos en formularios.

### 2. Gestión de productos (CRUD)

- Crear, leer, actualizar y eliminar productos.
- Subida de imágenes asociadas.
- Validaciones en servidor y cliente.

### 3. Chat en tiempo real

- Comunicación entre usuarios conectados.
- Notificaciones de entrada y salida del chat.

### 4. Vistas dinámicas con Handlebars

- Plantillas reutilizables.
- Diseño responsive.

### 5. Manejo de sesiones y roles

- Persistencia con MongoDB.
- Control de acceso por tipo de usuario.

---

## Estructura del proyecto

```
MiInventarioExpress/
├── src/
│   ├── config/             # Configuración de conexión a la base de datos
│   │   └── db.js
│   ├── controllers/        # Lógica de negocio de la aplicación
│   ├── middlewares/        # Funciones intermedias (auth, validaciones, etc.)
│   ├── models/             # Modelos de datos de MongoDB
│   │   ├── Producto.js
│   │   └── Usuario.js
│   ├── public/             # Archivos estáticos (CSS, JS, imágenes)
│   ├── routes/             # Definición de rutas de la API y vistas
│   ├── uploads/            # Archivos cargados por usuarios
│   ├── validators/         # Validaciones personalizadas
│   ├── views/              # Vistas Handlebars
│   │   ├── auth/
│   │   ├── layouts/
│   │   ├── partials/
│   │   └── productos/
│   │       └── chat.hbs
│   └── index.js            # Punto de entrada de la aplicación
├── .env                    # Variables de entorno
├── .gitignore              # Archivos y carpetas ignorados por Git
├── package.json            # Dependencias y scripts del proyecto
├── package-lock.json
└── README.md               # Documentación del proyecto
```

---

## Instalación y configuración

### Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/miinventarioexpress
SESSION_SECRET=clave_secreta_dev
```

### 4. Ejecutar la aplicación

```bash
npm run dev
```

Abrir en el navegador:  
[http://localhost:3000](http://localhost:3000)

---

## Rutas principales

| Ruta                    | Descripción                          |
| ----------------------- | ------------------------------------ |
| `/`                     | Redirección según sesión             |
| `/login`                | Página de inicio de sesión           |
| `/registro`             | Registro de nuevo usuario            |
| `/productos`            | Listado de productos                 |
| `/productos/nuevo`      | Crear nuevo producto                 |
| `/productos/:id/editar` | Editar producto                      |
| `/chat`                 | Chat en tiempo real (requiere login) |
| `/api/auth/*`           | Endpoints de autenticación           |
| `/api/productos/*`      | Endpoints CRUD de productos          |

---

## Pruebas

- **Postman:** validación de endpoints `/api/auth` y `/api/productos`
- **Navegador:** interacción con vistas, formularios y chat
- **Consola:** monitoreo de logs con `morgan`

---

## Conclusión

El proyecto **MiInventarioExpress** demuestra la integración de tecnologías modernas de desarrollo web full stack con Node.js y MongoDB.  
Su estructura modular, autenticación segura y comunicación en tiempo real lo convierten en una base sólida para aplicaciones de gestión y colaboración.
