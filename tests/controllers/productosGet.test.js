const Producto = require('../../models/Producto');
const Usuario = require('../../models/Usuario');
const Categoria = require('../../models/Categoria');
const request = require('supertest');
const app = require('../../app');
const bcrypt = require('bcryptjs');

describe('GET /productos', () => {
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
