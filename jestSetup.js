jest.setTimeout(30000);

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const session = require('express-session');
const createSession = require('./config/session'); //Sesion
const app = require('./app');  // Express

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
