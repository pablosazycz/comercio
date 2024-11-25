const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Usuario = require('../../models/Usuario');
const Producto = require('../../models/Producto');
const Categoria = require('../../models/Categoria');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(10000);

let mongoServer;
let categoria;
let producto;

let adminAgent;
let clienteAgent;


// Antes de las pruebas
beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
});

// Después de las pruebas
afterAll(async () => {
    //Limpia la BD
    await Producto.deleteMany({});
    await Usuario.deleteMany({});
    await Categoria.deleteMany({});
    // Si mongo esta conectado desconectar
    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
    }
});

beforeEach(async () => {
    // Limpia las colecciones 
    await Categoria.deleteMany({});
    await Usuario.deleteMany({});
    await Producto.deleteMany({});

    // Crea una categoría de prueba
    categoria = await Categoria.create({
        nombre: 'Categoría Test',
        descripcion: 'Descripción de prueba',
    });

    // Crea usuario con rol de admin con contraseña Encriptada
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    adminUser = await Usuario.create({
        nombre: 'Admin',
        apellido: 'Usuario',
        email: 'admin@ejemplo.com',
        password: hashedPasswordAdmin,
        rol: 'admin',
    });

    // Crea usuario con rol de cliente con contraseña Encriptada
    const hashedPasswordCliente = await bcrypt.hash('cliente123', 10);
    clienteUser = await Usuario.create({
        nombre: 'Cliente',
        apellido: 'Usuario',
        email: 'cliente@ejemplo.com',
        password: hashedPasswordCliente,
        rol: 'cliente',
    });

    // Crea un producto en la BD
    producto = await Producto.create({
        nombre: 'Producto Test',
        descripcion: 'Descripción de prueba',
        precio: 99.99,
        categoria: categoria._id,
    });

    // Inicializa los supertest agents (para el manejo de las sesiones)
    adminAgent = request.agent(app);
    clienteAgent = request.agent(app);

    // Simula el login del admin
    await adminAgent
        .post('/api/login')
        .send({
            email: 'admin@ejemplo.com',
            password: 'admin123',
        });

    // Simula el login del cliente
    await clienteAgent
        .post('/api/login')
        .send({
            email: 'cliente@ejemplo.com',
            password: 'cliente123',
        });
});

afterEach(async () => {
    // Limpia las colecciones de la BD después de cada prueba
    await Usuario.deleteMany({});
});


// ====================== REGISTRO Usuario ================

describe('POST /usuarios/registro', () => {

    it('El Usuario se debería poder registrar correctamente', async () => {
        const nuevoUsuario = {
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan@ejemplo.com',
            password: 'juan123',
            confirmPassword: 'juan123'
        };

        // Hace la solicitud POST para registrar el usuario
        const res = await request(app)
            .post('/usuarios/registro')
            .send(nuevoUsuario);

        // Registro exitoso
        expect(res.status).toBe(302); // Si se obtiene 302
        expect(res.headers.location).toBe('/usuarios/login');  // Y si redirige al login

        // Verifica si el usuario fue creado en la BD
        const usuarioEnDB = await Usuario.findOne({ email: nuevoUsuario.email });
        expect(usuarioEnDB).not.toBeNull();  // El Usuario tiene que estar en la BD
        expect(usuarioEnDB.email).toBe(nuevoUsuario.email);
    });

    it('El Usuario no debería poder registrarse si las contraseñas no coinciden', async () => {
        const usuario = {
            nombre: 'Pedro',
            apellido: 'González',
            email: 'pedro@ejemplo.com',
            password: 'password123',
            confirmPassword: 'password456'
        };

        const res = await request(app)
            .post('/usuarios/registro')
            .send(usuario);

        expect(res.status).toBe(200);  // El form debería volver a renderizarse
        expect(res.text).toContain('Las contraseñas no coinciden');
    });

    it('El Usuario no debería poder registrarse si el email ya está registrado', async () => {
        const usuarioDuplicado = {
            nombre: 'Carlos',
            apellido: 'Sánchez',
            email: 'admin@ejemplo.com',
            password: 'newpassword123',
            confirmPassword: 'newpassword123'
        };

        const res = await request(app)
            .post('/usuarios/registro')
            .send(usuarioDuplicado);

        expect(res.status).toBe(200);
        expect(res.text).toContain('El email ya está registrado');
    });
});

// ======================= LOGIN ==========================

// ===================== POST /API/LOGIN ==================

describe('POST /api/login', () => {
    it('El Usuario que tiene rol de Admin debería poder ingresar al sistema', async () => {
        // Simula el login del usuario con rol de admin
        const res = await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@ejemplo.com',
                password: 'admin123',
            });
        expect(res.status).toBe(200);
    });

    it('El Usuario que tiene rol de Cliente debería poder ingresar al sistema', async () => {
        // Simula el login del usuario con rol de cliente
        const res = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@ejemplo.com',
                password: 'cliente123',
            });
        expect(res.status).toBe(200);
    });

    it('El Usuario no debería ingresar al sistema con credenciales incorrectas', async () => {
        // Simula intento de login con credenciales incorrectas (c323hds)
        const res = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@ejemplo.com',
                password: 'c323hds',
            });
        expect(res.status).toBe(401);
    });
});



// ====================== CATEGORIAS ======================

// ====================== GET Categoria ===================

describe('GET /categorias', () => {

    it("Un admin puede ver las categorias", async () => {
        const res = await adminAgent.get('/api/categorias');
        expect(res.status).toBe(200); // Se cargan las categorias
    });

    it("Un cliente puede ver las categorias", async () => {
        const res = await clienteAgent.get('/api/categorias');
        expect(res.status).toBe(200); // Se cargan las categorias
    });
});

// ====================== POST Categoria ==================

describe('POST /categorias', () => {
    it("Un admin puede crear una categoría", async () => {
        // Simula el login como admin
        const adminLoginRes = await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@ejemplo.com',
                password: 'admin123',
            });

        // Accede a las cookies para seguir en la sesión iniciada
        // Las separa antes del punto y coma y las une en una sola string
        const cookies = adminLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del admin:", cookies);  // Imprime las cookies

        // Definimos los datos para la nueva categoría
        const newCategoria = {
            nombre: 'Categoría Test 2',
            descripcion: 'Descripción de prueba 2',
        };

        // Se hace la solicitud POST para crear la nueva categoría
        const resPost = await adminAgent
            .post('/api/categorias')  // Ruta para crear la categoría
            .set('Cookie', cookies)  // Fija las cookies para mantener la sesión
            .send(newCategoria);  // Envía la nueva categoría

        expect(resPost.status).toBe(201);
        expect(resPost.body).toHaveProperty('nombre', 'Categoría Test 2');
        expect(resPost.body).toHaveProperty('descripcion', 'Descripción de prueba 2');
    });

    it("Un cliente no puede crear una categoría", async () => {
        // Simula el login como cliente
        const clienteLoginRes = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@ejemplo.com',
                password: 'cliente123',
            });

        // Accede a las cookies para seguir en la sesión iniciada
        // Las separa antes del punto y coma y las une en una sola string
        const cookies = clienteLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del cliente:", cookies);  // Imprime las cookies

        // Definimos los datos para la nueva categoría
        const newCategoria = {
            nombre: 'Categoría Test 2',
            descripcion: 'Descripción de prueba 2',
        };

        // Se hace la solicitud POST para crear la nueva categoría
        const resPost = await clienteAgent
            .post('/api/categorias')  // Ruta para crear la categoría
            .set('Cookie', cookies)  // Fija las cookies para mantener la sesión
            .send(newCategoria);  // Envía la nueva categoría

        expect(resPost.status).toBe(403); //Acceso denegado
    });
});

// ====================== PUT Categoria ===================

describe('PUT /categorias', () => {
    it("Un admin puede editar una categoría", async () => {
        // Simula el login como admin
        const adminLoginRes = await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@ejemplo.com',
                password: 'admin123',
            });

        // Accede a las cookies 
        const cookies = adminLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del admin:", cookies);  // Imprime las cookies 

        // Definimos datos para editar la categoría
        const editarCategoria = {
            nombre: 'Categoría Editada',
            descripcion: 'Descripción editada',
        };

        // Hacemos la solicitud POST para editar la categoría
        const resPost = await adminAgent
            .put(`/api/categorias/${categoria._id}`)  // Ruta para editar la categoría por su ID
            .set('Cookie', cookies)  // Utiliza las cookies para mantener la sesión
            .send(editarCategoria);  // Envía la categoría editada

        // Verifica la respuesta
        expect(resPost.status).toBe(200);
        expect(resPost.body).toHaveProperty('nombre', 'Categoría Editada');
        expect(resPost.body).toHaveProperty('descripcion', 'Descripción editada');
    });

    it("Un cliente no puede editar una categoría", async () => {
        // Simula el login como cliente
        const clienteLoginRes = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@ejemplo.com',
                password: 'cliente123',
            });

        // Accede a las cookies 
        const cookies = clienteLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del cliente:", cookies);  // Imprime las cookies 

        // Definimos datos para editar la categoría
        const editarCategoria = {
            nombre: 'Categoría Editada',
            descripcion: 'Descripción editada',
        };

        // Hacemos la solicitud POST para editar la categoría
        const resPost = await clienteAgent
            .put(`/api/categorias/${categoria._id}`)  // Ruta para editar la categoría por su ID
            .set('Cookie', cookies)  // Utiliza las cookies para mantener la sesión
            .send(editarCategoria);  // Envía la categoría editada

        // Verifica la respuesta
        expect(resPost.status).toBe(403); //Acceso denegado
    });
});

// ====================== DELETE Categoria ================

describe('DELETE /categorias', () => {
    it("Un admin puede eliminar una categoría", async () => {
        // Simula el login como admin
        const adminLoginRes = await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@ejemplo.com',
                password: 'admin123',
            });

        // Guardamos las cookies para seguir en la sesión
        const cookies = adminLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del admin:", cookies);  // Imprime las cookies 

        // Hacemos la solicitud POST para eliminar la categoría
        const res = await adminAgent
            .delete(`/api/categorias/${categoria._id}`)  // Ruta para eliminar la categoría por su ID
            .set('Cookie', cookies)  // Utiliza las cookies 
            .send();
        // Verifica la respuesta
        expect(res.status).toBe(204);  // 204: Eliminación exitosa
    });

    it("Un cliente no puede eliminar una categoría", async () => {
        // Simula el login como admin
        const clienteLoginRes = await adminAgent
            .post('/api/login')
            .send({
                email: 'cliente@ejemplo.com',
                password: 'cliente123',
            });

        // Guardamos las cookies para seguir en la sesión
        const cookies = clienteLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del cliente:", cookies);  // Imprime las cookies 

        // Hacemos la solicitud POST para eliminar la categoría
        const res = await clienteAgent
            .delete(`/api/categorias/${categoria._id}`)  // Ruta para eliminar la categoría por su ID
            .set('Cookie', cookies)  // Utiliza las cookies 
            .send();

        // Verifica la respuesta
        expect(res.status).toBe(403);  // Acceso denegado para el cliente
    });
});



// ====================== PRODUCTOS ======================

// ===================== GET /API/PRODUCTOS ==============

describe('GET /productos', () => {
    it('Un admin debería poder ver todos los productos', async () => {
        const res = await adminAgent.get('/api/productos');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1); // Solo un producto en la BD
        expect(res.body[0].nombre).toBe('Producto Test');
    });

    it('Un admin debería poder ver un producto por ID', async () => {
        const res = await adminAgent.get(`/api/productos/${producto._id}`);
        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe('Producto Test');
    });

    it('Un cliente debería poder ver todos los productos', async () => {
        const res = await clienteAgent.get('/api/productos');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].nombre).toBe('Producto Test');
    });

    it('Un cliente debería poder ver un producto por ID', async () => {
        const res = await clienteAgent.get(`/api/productos/${producto._id}`);
        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe('Producto Test');
    });

    it('Un admin recibe 404 si el producto no existe', async () => {
        const invalidId = '60c72b2f9b1d8c9f75f6d4c3'; // ID inválido
        const res = await adminAgent.get(`/api/productos/${invalidId}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Producto no encontrado');
    });


    it('Un cliente recibe 404 si el producto no existe', async () => {
        const invalidId = '60c72b2f9b1d8c9f75f6d4c3'; // ID inválido
        const res = await clienteAgent.get(`/api/productos/${invalidId}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Producto no encontrado');
    });
});

// ====================== POST Producto ===================

describe('POST /productos', () => {
    it("Un admin puede crear un producto", async () => {
        // Simula el login como admin
        const adminLoginRes = await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@ejemplo.com',
                password: 'admin123',
            });

        // Accede a las cookies para seguir en la sesión iniciada
        // Las separa antes del punto y coma y las une en una sola string
        const cookies = adminLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del admin:", cookies);  // Imprime las cookies

        // Definimos los datos para el nuevo producto
        const nuevoProducto = {
            nombre: 'Nuevo Producto Test',
            descripcion: 'Descripción del nuevo producto',
            precio: 149.99,
            categoria: categoria._id,
        };

        // Se hace la solicitud POST para crear un nuevo producto
        const resPost = await adminAgent
            .post('/api/productos')  // Ruta para crear un producto
            .set('Cookie', cookies)  // Usa las cookies para mantener la sesión
            .send(nuevoProducto);  // Envía el nuevo producto

        // Verifica la respuesta
        expect(resPost.status).toBe(201);
        expect(resPost.body).toHaveProperty('nombre', 'Nuevo Producto Test');
        expect(resPost.body).toHaveProperty('descripcion', 'Descripción del nuevo producto');
    });

    it("Un cliente no puede crear un producto", async () => {
        // Simula el login como admin
        const clienteLoginRes = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@ejemplo.com',
                password: 'cliente123',
            });

        // Accede a las cookies para seguir en la sesión iniciada
        // Las separa antes del punto y coma y las une en una sola string
        const cookies = clienteLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del cliente:", cookies);  // Imprime las cookies

        // Definimos los datos para el nuevo producto
        const nuevoProducto = {
            nombre: 'Nuevo Producto Test',
            descripcion: 'Descripción del nuevo producto',
            precio: 149.99,
            categoria: categoria._id,
        };

        // Se hace la solicitud POST para crear un nuevo producto
        const resPost = await clienteAgent
            .post('/api/productos')  // Ruta para crear un producto
            .set('Cookie', cookies)  // Usa las cookies para mantener la sesión
            .send(nuevoProducto);  // Envía el nuevo producto

        // Verifica la respuesta
        expect(resPost.status).toBe(403); //Acceso denegado
    });
});

// ====================== PUT Producto ===================

describe('PUT /productos', () => {
    it("Un admin puede editar una producto", async () => {
        // Simula el login como admin
        const adminLoginRes = await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@ejemplo.com',
                password: 'admin123',
            });

        // Accede a las cookies 
        const cookies = adminLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del admin:", cookies);  // Imprime las cookies 

        // Definimos los datos para editar el producto
        let productoAct = {
            nombre: "Producto editado",
            descripcion: "Descripción editada",
            precio: 500,
            categoria: categoria._id,
        };

        // Hacemos la solicitud POST para editar el producto
        const resPost = await adminAgent
            .put(`/api/productos/${producto._id}`)  // Ruta para editar el producto por su ID
            .set('Cookie', cookies)  // Utiliza las cookies seguir conectado
            .send(productoAct);  // Envía los datos del producto editado

        // Verifica la respuesta
        expect(resPost.status).toBe(200);
        expect(resPost.body).toHaveProperty('nombre', 'Producto editado');
        expect(resPost.body).toHaveProperty('descripcion', 'Descripción editada');
    });

    it("Un cliente no puede editar una producto", async () => {
        // Simula el login como admin
        const clienteLoginRes = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@ejemplo.com',
                password: 'cliente123',
            });

        // Accede a las cookies 
        const cookies = clienteLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del cliente:", cookies);  // Imprime las cookies 

        // Definimos los datos para editar el producto
        let productoAct = {
            nombre: "Producto editado",
            descripcion: "Descripción editada",
            precio: 500,
            categoria: categoria._id,
        };

        // Hacemos la solicitud POST para editar el producto
        const resPost = await clienteAgent
            .put(`/api/productos/${producto._id}`)  // Ruta para editar el producto por su ID
            .set('Cookie', cookies)  // Utiliza las cookies seguir conectado
            .send(productoAct);  // Envía los datos del producto editado

        // Verifica la respuesta
        expect(resPost.status).toBe(403);//Acceso denegado
    });
});


// ====================== DELETE Producto ===================

describe('DELETE /producto', () => {

    it("Un admin puede eliminar un producto", async () => {
        // Simula el login como admin
        const adminLoginRes = await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@ejemplo.com',
                password: 'admin123',
            });

        // Guardamos las cookies para seguir en la sesión
        const cookies = adminLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del admin:", cookies);  // Imprime las cookies

        // Hacemos la solicitud POST para eliminar el producto
        const res = await adminAgent
            .delete(`/api/productos/${producto._id}`)  // Ruta para eliminar el producto por ID
            .set('Cookie', cookies)  // Utiliza las cookies 
            .send();

        expect(res.status).toBe(204);  // 204: Eliminación exitosa
    });

    it("Un cliente no puede eliminar un producto", async () => {
        // Simula el login como cliente
        const clienteLoginRes = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@ejemplo.com',
                password: 'cliente123',
            });

        // Guardamos las cookies para seguir en la sesión
        const cookies = clienteLoginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

        console.log("Cookies del cliente:", cookies);  // Imprime las cookies

        // Hacemos la solicitud POST para eliminar el producto
        const res = await clienteAgent
            .delete(`/api/productos/${producto._id}`)  // Ruta para eliminar el producto por ID
            .set('Cookie', cookies)  // Utiliza las cookies 
            .send();

        expect(res.status).toBe(403);  // Acceso denegado
    });
});