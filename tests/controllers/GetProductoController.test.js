const Producto = require('../../models/Producto');
const Usuario = require('../../models/Usuario');
const Categoria = require('../../models/Categoria');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

jest.setTimeout(30000);

const { MongoMemoryServer } = require('mongodb-memory-server');
const session = require('express-session');
const createSession = require('../../config/session'); //Sesion
const app = require('../../app');  // Express

let mongoServer;
let mongoUri;

beforeAll(async () => {
    if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri(); // Esto es lo que debes pasar a MongoStore
    }

    // Conectar a MongoDB en memoria
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }

    // Configura las sesiones para usar MongoDB en memoria
    app.use(createSession(mongoUri)); // Usamos mongoUri de MongoMemoryServer 
});

afterEach(async () => {
    // Limpia las colecciones después de cada prueba
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    // Cierra la conexión a la BD y detiene el servidor
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});


describe('POST /api/login y GET /api/productos', () => {
    let adminAgent, clienteAgent;
    let adminUser, clienteUser;
    let producto;

    beforeEach(async () => {
        // Limpia las colecciones antes de insertar datos
        await Categoria.deleteMany({});
        await Usuario.deleteMany({});
        await Producto.deleteMany({});

        // Crear categoría de prueba
        const categoria = await Categoria.create({
            nombre: 'Categoría Test',
            descripcion: 'Descripción de prueba',
        });

        // Crear usuarios admin y cliente con contraseñas encriptadas
        const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
        adminUser = await Usuario.create({
            nombre: 'Admin',
            apellido: 'Usuario',
            email: 'admin@example.com',
            password: hashedPasswordAdmin,
            rol: 'admin',
        });

        const hashedPasswordCliente = await bcrypt.hash('cliente123', 10);
        clienteUser = await Usuario.create({
            nombre: 'Cliente',
            apellido: 'Usuario',
            email: 'cliente@example.com',
            password: hashedPasswordCliente,
            rol: 'cliente',
        });

        // Crear producto
        producto = await Producto.create({
            nombre: 'Producto Test',
            descripcion: 'Descripción de prueba',
            precio: 99.99,
            categoria: categoria._id,
        });

        // Inicializa supertest agents para manejar sesiones
        adminAgent = request.agent(app);
        clienteAgent = request.agent(app);

        // Simula login de admin
        await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        // Simula el login de cliente
        await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@example.com',
                password: 'cliente123',
            });
    });

    afterEach(async () => {
        // Limpia las colecciones después de cada prueba
        await Categoria.deleteMany({});
        await Usuario.deleteMany({});
        await Producto.deleteMany({});
    });

    // ===================== POST /API/LOGIN =====================

    it('debería ingresar al sistema el usuario que tiene rol de Admin', async () => {
        // Simula login de admin
        const res = await adminAgent
            .post('/api/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });
        expect(res.status).toBe(200);
    });

    it('debería ingresar al sistema el usuario que tiene rol de Cliente', async () => {
        // Simula el login de cliente
        const res = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@example.com',
                password: 'cliente123',
            });
        expect(res.status).toBe(200);
    });

    it('ingresar al sistema con credenciales incorrectas', async () => {
        // Simula intento de login con credenciales incorrectas
        const res = await clienteAgent
            .post('/api/login')
            .send({
                email: 'cliente@example.com',
                password: 'c323hds',
            });
        expect(res.status).toBe(401);
    });

    // ===================== GET /API/PRODUCTOS =====================

    it('debería devolver todos los productos si el usuario tiene rol de admin', async () => {
        const res = await adminAgent.get('/api/productos');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1); // Solo un producto en la base de datos
        expect(res.body[0].nombre).toBe('Producto Test');
    });

    it('debería devolver producto por ID si el usuario tiene rol de admin', async () => {
        const res = await adminAgent.get(`/api/productos/${producto._id}`);
        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe('Producto Test');
    });

    it('debería devolver todos los productos si el usuario tiene rol de cliente', async () => {
        const res = await clienteAgent.get('/api/productos');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1); // Solo un producto en la base de datos
        expect(res.body[0].nombre).toBe('Producto Test');
    });

    it('debería devolver producto por ID si el usuario tiene rol de cliente', async () => {
        const res = await clienteAgent.get(`/api/productos/${producto._id}`);
        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe('Producto Test');
    });

    it('debería devolver 404 si el producto no existe', async () => {
        const invalidId = '60c72b2f9b1d8c9f75f6d4c3'; // ID no válido
        const res = await adminAgent.get(`/api/productos/${invalidId}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Producto no encontrado');
    });
});
