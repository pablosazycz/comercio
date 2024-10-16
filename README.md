# Comercio - Sistema de Gestión de Comercio

Este proyecto es una aplicación web para la gestión de un comercio, implementado utilizando **Node.js** con **Express**. La aplicación permite gestionar productos, clientes, y otros aspectos del comercio.

## Características

- **Gestión de Productos**: Permite agregar, editar, y eliminar productos.
- **Gestión de Clientes**: Permite registrar y gestionar clientes del comercio.
- **Plantillas EJS**: Utiliza EJS para renderizar vistas dinámicas en el servidor.
- **Rutas RESTful**: Organizado siguiendo el patrón MVC para un mantenimiento más sencillo.
- **Middleware**: Implementa middlewares personalizados para tareas comunes.

## Tecnologías

- **Node.js**
- **Express**
- **MongoDB** (o cualquier otra base de datos NoSQL compatible)
- **EJS** (Embedded JavaScript) para las vistas
- **CSS** y **JavaScript** para la interfaz de usuario

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/pablosazycz/comercio.git
   cd comercio

2. Instala las dependencias:

npm install

3. Configura las variables de entorno en un archivo .env (puedes basarte en el archivo de ejemplo .env.example si existe).

4. Inicia la aplicación:
npm start

5. Accede a la aplicación desde el navegador:
http://localhost:3000

Estructura del Proyecto
-controllers/: Contiene los controladores que manejan la lógica de la aplicación.
-middlewares/: Middlewares personalizados para la aplicación.
-models/: Modelos de datos (por ejemplo, esquemas de MongoDB).
-routes/: Define las rutas de la aplicación, mapeando URLs a controladores.
-views/: Plantillas EJS que renderizan el contenido dinámico.
-public/: Archivos estáticos (CSS, JavaScript, imágenes, etc.).

Uso
-Navega por las diferentes secciones del sistema para gestionar productos y clientes.
-Puedes agregar, editar o eliminar información según la funcionalidad de cada vista.

Scripts Disponibles
-npm start: Inicia la aplicación en modo producción.
-npm run dev: Inicia la aplicación en modo desarrollo usando nodemon para recarga automática.

Contribución
Si deseas contribuir al proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-caracteristica).
3. Realiza tus cambios y haz un commit (git commit -m 'Añadir nueva característica').
4. Sube tus cambios a tu repositorio fork (git push origin feature/nueva-caracteristica).
5. Abre un Pull Request.

Licencia
Este proyecto está licenciado bajo la MIT License - consulta el archivo LICENSE para más detalles.
